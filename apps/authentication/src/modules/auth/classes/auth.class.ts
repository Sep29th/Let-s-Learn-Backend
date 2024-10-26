import { Observable } from 'rxjs';
import { IToken } from '../interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { IRefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { TokenRepositoryService } from 'apps/authentication/src/mongo/token/token.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationRepositoryService } from 'apps/authentication/src/mongo/authentication/authentication.service';
import { Status } from 'apps/authentication/src/mongo/authentication/authentication.schema';
import { IAccessTokenPayload } from '@app/module/authentication/interfaces/access-token-payload.interface';

export abstract class Auth {
  constructor(
    private readonly authenticationRepository: AuthenticationRepositoryService,
    private readonly tokenRepository: TokenRepositoryService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  abstract signIn(...args: any): IToken | Promise<IToken> | Observable<IToken>;

  async signOut(refreshToken: string) {
    await this.tokenRepository.deleteTokenByRefreshToken(refreshToken);
  }

  async signOutOfAllOtherDevices(refreshToken: string, payload: IRefreshTokenPayload) {
    await this.tokenRepository.deleteManyTokenByAuthenticationId(payload.authenticationId, refreshToken);
  }

  async signOutOtherDevice(refreshToken: string) {
    await this.tokenRepository.deleteTokenByRefreshToken(refreshToken);
  }

  async refreshToken(refreshToken: string, payload: IRefreshTokenPayload): Promise<IToken> {
    const checkAuthenticationStatus = await this.authenticationRepository.getAuthenticationById(payload.authenticationId);
    if (checkAuthenticationStatus.status == Status.LOCKED) throw new BadRequestException('AU0006');
    if (checkAuthenticationStatus.status == Status.DELETED) throw new BadRequestException('AU0007');
    const checkExist = await this.tokenRepository.getTokenByRefreshToken(refreshToken);
    if (!checkExist) throw new UnauthorizedException('AU0003');
    const newRefreshToken = await this.jwtService.signAsync(payload, { algorithm: 'RS512', expiresIn: '180d', secret: this.configService.get<string>('JWT_REFRESH_PUBLIC_KEY') });
    await this.tokenRepository.updateTokenByRefreshToken(refreshToken, newRefreshToken);
    const newAccessToken = await this.jwtService.signAsync({} as IAccessTokenPayload, { algorithm: 'RS256', expiresIn: '4h', secret: this.configService.get<string>('JWT_ACCESS_PUBLIC_KEY') });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
