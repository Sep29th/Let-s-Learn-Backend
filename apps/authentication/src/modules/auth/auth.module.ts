import { Module } from '@nestjs/common';
import { GoogleOauthController } from './controllers/google-oauth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CredentialService } from './services/credential.service';
import { GoogleOauthService } from './services/google-oauth.service';
import { Auth } from './classes/auth.class';
import { AuthController } from './controllers/auth.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { CredentialController } from './controllers/credential.controller';
import { CacheModule } from '@app/module/cache/cache.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule,
    CacheModule.forRootAsync({
      isGlobal: false,
      cacheType: 'redis',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        nonBlocking: true,
        options: {
          uri: `redis://${configService.get<string>('REDIS_USER') && `${configService.get<string>('REDIS_USER')}:${configService.get<string>('REDIS_PASS')}@`}${configService.get<string>('REDIS_HOST')}:${configService.get<string>('REDIS_PORT')}/${configService.get<string>('REDIS_DB')}`,
        },
      }),
    }),
  ],
  controllers: [AuthController, CredentialController, GoogleOauthController],
  providers: [RefreshTokenStrategy, CredentialService, GoogleOauthService, { provide: Auth, useClass: CredentialService }],
})
export class AuthModule {}
