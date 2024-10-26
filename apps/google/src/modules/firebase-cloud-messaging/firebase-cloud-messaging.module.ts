import { Module } from '@nestjs/common';
import { FirebaseCloudMessagingService } from './services/firebase-cloud-messaging.service';
import { FirebaseCloudMessagingController } from './controllers/firebase-cloud-messaging.controller';

@Module({
  controllers: [FirebaseCloudMessagingController],
  providers: [FirebaseCloudMessagingService],
})
export class FirebaseCloudMessagingModule {}
