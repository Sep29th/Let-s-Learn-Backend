import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthModule } from './modules/oauth/oauth.module';
import { FirebaseCloudMessagingModule } from './modules/firebase-cloud-messaging/firebase-cloud-messaging.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OauthModule, FirebaseCloudMessagingModule],
})
export class AppModule {}
