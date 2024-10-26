import { Module } from '@nestjs/common';
import { OauthService } from './services/oauth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OauthController } from './controllers/oauth.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get<number>('HTTP_MODULE_TIMEOUT', 5000),
        maxRedirects: configService.get<number>('HTTP_MODULE_MAX_REDIRECTS', 5),
      }),
    }),
  ],
  controllers: [OauthController],
  providers: [OauthService],
  exports: [OauthService],
})
export class OauthModule {}
