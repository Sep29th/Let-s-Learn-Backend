import { Module } from '@nestjs/common';
import { GoogleOauthController } from './controllers/google-oauth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CredentialService } from './services/credential.service';
import { GoogleOauthService } from './services/google-oauth.service';
import { Auth } from './classes/auth.class';
import { AuthController } from './controllers/auth.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [JwtModule],
  controllers: [AuthController, GoogleOauthController],
  providers: [RefreshTokenStrategy, CredentialService, GoogleOauthService, { provide: Auth, useClass: CredentialService }],
})
export class AuthModule {}
