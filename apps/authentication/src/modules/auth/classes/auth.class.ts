import { Observable } from 'rxjs';
import { IToken } from '../types/token.type';
import { JwtService } from '@nestjs/jwt';
import { IRefreshTokenPayload } from '../types/refresh-token-payload.type';
import { ConfigService } from '@nestjs/config';
import { TokenRepositoryService } from 'apps/authentication/src/mongo/token/token.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationRepositoryService } from 'apps/authentication/src/mongo/authentication/authentication.service';
import { Status } from 'apps/authentication/src/mongo/authentication/authentication.schema';
import { IAccessTokenPayload } from '@app/module/authentication/interfaces/access-token-payload.interface';

export abstract class Auth {
  constructor(
    protected readonly authenticationRepository: AuthenticationRepositoryService,
    protected readonly tokenRepository: TokenRepositoryService,
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
  ) {}

  abstract signIn(...args: any): IToken | Promise<IToken | Observable<IToken>> | Observable<IToken>;

  async signOut(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteTokenByRefreshToken(refreshToken);
  }

  async signOutOfAllOtherDevices(refreshToken: string, payload: IRefreshTokenPayload): Promise<void> {
    await this.tokenRepository.deleteManyTokenByAuthenticationId(payload.authenticationId, refreshToken);
  }

  async signOutOtherDevice(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteTokenByRefreshToken(refreshToken);
  }

  async refreshToken(refreshToken: string, payload: IRefreshTokenPayload): Promise<IToken> {
    const checkExist = await this.tokenRepository.getTokenByRefreshToken(refreshToken);
    if (!checkExist) throw new UnauthorizedException('AU0003');
    const auth = await this.authenticationRepository.getAuthenticationById(payload.authenticationId);
    this.checkAuthenticationStatus(auth.status, [Status.LOCKED, Status.DELETED]);
    const [newRefreshToken, newAccessToken] = await Promise.all([
      this.jwtService.signAsync({ authenticationId: auth._id.toString() } as IRefreshTokenPayload, {
        algorithm: 'RS512',
        expiresIn: '180d',
        secret: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
      }),
      this.jwtService.signAsync({ authenticationId: auth._id.toString(), roles: auth.roles } as IAccessTokenPayload, {
        algorithm: 'RS256',
        expiresIn: '4h',
        secret: this.configService.get<string>('JWT_ACCESS_PRIVATE_KEY'),
      }),
    ]);
    await this.tokenRepository.updateTokenByRefreshToken(refreshToken, newRefreshToken);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async verifyPhonenumber(authenticationId: string) {
    const auth = await this.authenticationRepository.getAuthenticationById(authenticationId);
    this.checkAuthenticationStatus(auth.status, [Status.DELETED, Status.LOCKED]);
  }

  protected checkAuthenticationStatus(status: Status, unaccept: Status[]) {
    unaccept.forEach((unacceptStatus) => {
      if (status == unacceptStatus) {
        if (unacceptStatus == Status.LOCKED) throw new BadRequestException('AU0006');
        else if (unacceptStatus == Status.DELETED) throw new BadRequestException('AU0007');
        else if (unacceptStatus == Status.ACTIVE) throw new BadRequestException('AU0008');
        else if (unacceptStatus == Status.UNACTIVE) throw new BadRequestException('AU0009');
      }
    });
  }
}
