import { Controller } from '@nestjs/common';
import { FirebaseCloudMessagingService } from '../services/firebase-cloud-messaging.service';
import { Ctx, EventPattern, KafkaContext, KafkaRetriableException, Payload } from '@nestjs/microservices';
import { GoogleEventMessage } from 'kafka/event-message/google';

@Controller('fcm')
export class FirebaseCloudMessagingController {
  constructor(private readonly firebaseCloudMessagingService: FirebaseCloudMessagingService) {}

  @EventPattern(GoogleEventMessage.Pattern.Send)
  async send(@Payload() payload: GoogleEventMessage.IPatternSendPayload, @Ctx() ctx: KafkaContext) {
    try {
      await this.firebaseCloudMessagingService.sendNotification(payload.data);
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }

  @EventPattern(GoogleEventMessage.Pattern.SendEach)
  async sendEach(@Payload() payload: GoogleEventMessage.IPatternSendEachPayload, @Ctx() ctx: KafkaContext) {
    try {
      await this.firebaseCloudMessagingService.sendEachNotification(payload.data);
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }

  @EventPattern(GoogleEventMessage.Pattern.SendEachForMulticast)
  async sendEachForMulticast(@Payload() payload: GoogleEventMessage.IPatternSendEachForMulticastPayload, @Ctx() ctx: KafkaContext) {
    try {
      await this.firebaseCloudMessagingService.sendEachForMulticastNotification(payload.data);
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }
}
