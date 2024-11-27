import { Controller } from '@nestjs/common';
import { FirebaseCloudMessagingService } from '../services/firebase-cloud-messaging.service';
import { Ctx, EventPattern, KafkaContext, KafkaRetriableException, Payload } from '@nestjs/microservices';
import { Topic, IPatternSendPayload, IPatternSendEachPayload, IPatternSendEachForMulticastPayload } from 'kafka/event-message/google';

@Controller('fcm')
export class FirebaseCloudMessagingController {
  constructor(private readonly firebaseCloudMessagingService: FirebaseCloudMessagingService) {}

  @EventPattern(Topic.Send)
  async send(@Payload() payload: IPatternSendPayload, @Ctx() ctx: KafkaContext) {
    try {
      await this.firebaseCloudMessagingService.sendNotification(payload.data);
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }

  @EventPattern(Topic.SendEach)
  async sendEach(@Payload() payload: IPatternSendEachPayload, @Ctx() ctx: KafkaContext) {
    try {
      await this.firebaseCloudMessagingService.sendEachNotification(payload.data);
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }

  @EventPattern(Topic.SendEachForMulticast)
  async sendEachForMulticast(@Payload() payload: IPatternSendEachForMulticastPayload, @Ctx() ctx: KafkaContext) {
    try {
      await this.firebaseCloudMessagingService.sendEachForMulticastNotification(payload.data);
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }
}
