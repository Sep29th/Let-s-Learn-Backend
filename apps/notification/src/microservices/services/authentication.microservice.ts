import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IPatternFailedSendVerificationEmailPayload, Topic } from 'kafka/event-message/authentication';

@Injectable()
export class AuthenticationMicroservice {
  constructor(@Inject('AUTHENTICATION_SERVICE_ASYNC') private authenticationServiceAsync: ClientKafka) {}

  sendVerificationEmailFailed(email: string): void {
    this.authenticationServiceAsync.emit<void, IPatternFailedSendVerificationEmailPayload>(Topic.FailedSendVerificationEmail, { data: { email } });
  }
}
