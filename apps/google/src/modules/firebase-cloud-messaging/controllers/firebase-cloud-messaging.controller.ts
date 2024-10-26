import { Controller } from '@nestjs/common';
import { FirebaseCloudMessagingService } from '../services/firebase-cloud-messaging.service';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { GoogleEventMessage } from 'kafka/event-message/google';

@Controller('fcm')
export class FirebaseCloudMessagingController {
  constructor(private readonly firebaseCloudMessagingService: FirebaseCloudMessagingService) {}

  @EventPattern(GoogleEventMessage.Pattern.Send)
  async send(@Payload() payload: GoogleEventMessage.IPatternSendPayload, @Ctx() ctx: KafkaContext) {
    await this.firebaseCloudMessagingService.sendNotification(payload.data);
  }

  @EventPattern(GoogleEventMessage.Pattern.SendEach)
  async sendEach(@Payload() payload: GoogleEventMessage.IPatternSendEachPayload, @Ctx() ctx: KafkaContext) {
    await this.firebaseCloudMessagingService.sendEachNotification(payload.data);
  }

  @EventPattern(GoogleEventMessage.Pattern.SendEachForMulticast)
  async sendEachForMulticast(@Payload() payload: GoogleEventMessage.IPatternSendEachForMulticastPayload, @Ctx() ctx: KafkaContext) {
    await this.firebaseCloudMessagingService.sendEachForMulticastNotification(payload.data);
  }
}
