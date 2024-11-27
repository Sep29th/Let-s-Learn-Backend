import { Injectable } from '@nestjs/common';
import { Auth } from '../classes/auth.class';
import { firstValueFrom, Observable } from 'rxjs';
import { IToken } from '../types/token.type';
import { AuthenticationRepositoryService } from 'apps/authentication/src/mongo/authentication/authentication.service';
import { TokenRepositoryService } from 'apps/authentication/src/mongo/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GoogleMicroservice } from 'apps/authentication/src/microservices/services/google.microservice';
import { AccountType } from 'apps/authentication/src/mongo/authentication/authentication.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IRefreshTokenPayload } from '../types/refresh-token-payload.type';
import { IAccessTokenPayload } from '../types/access-token-payload.type';
import { ILoginWithGoogle } from '../types/login-with-google.type';

@Injectable()
export class GoogleOauthService extends Auth {
  constructor(
    protected readonly authenticationRepository: AuthenticationRepositoryService,
    protected readonly tokenRepository: TokenRepositoryService,
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    private readonly googleMicroservice: GoogleMicroservice,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(authenticationRepository, tokenRepository, configService, jwtService);
  }

  async signIn(googleClientRequest: ILoginWithGoogle): Promise<IToken | Observable<IToken>> {
    const userInfo = await firstValueFrom(this.googleMicroservice.loginWithGoogle(googleClientRequest));
    let auth = await this.authenticationRepository.getAuthenticationByEmailAndAccountTypeOrNicknameOrPhoneNumber(userInfo.email, AccountType.GOOGLE);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (!auth)
        auth = await this.authenticationRepository.createAuthentication({
          email: userInfo.email,
          account_type: AccountType.GOOGLE,
          email_verified: userInfo.verified_email,
          roles: ['LEARNER'],
          name: userInfo.name,
        });
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
      await this.tokenRepository.createTokenByRefreshToken(
        {
          authentication_id: auth,
          refresh_token: newRefreshToken,
          device_token: googleClientRequest.deviceToken,
          OS: googleClientRequest.OS,
          platform: googleClientRequest.platform,
        },
        { session },
      );
      session.commitTransaction();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
