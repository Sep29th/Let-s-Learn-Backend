import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthModule } from './modules/oauth/oauth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OauthModule],
})
export class AppModule {}
