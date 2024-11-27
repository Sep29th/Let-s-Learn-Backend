import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IPatternMailVerificationEmailPayload, MailType, Topic } from 'kafka/event-message/notification';

@Injectable()
export class NotificationMicroservice {
  constructor(@Inject('NOTIFICATION_SERVICE_ASYNC') private notificationServiceAsync: ClientKafka) {}

  sendVerificationEmail(targetEmail: string, code: string, expires: number): void {
    this.notificationServiceAsync.emit<void, IPatternMailVerificationEmailPayload>(Topic.Mail, { mailType: MailType.VERIFYCATION_EMAIL, data: { code, expires }, targetEmail });
  }
}
