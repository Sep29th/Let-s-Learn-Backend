import { InjectQueue, OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { MessageData, MessageType, QueueName } from '../interfaces/mail-queue';
import { Queue } from 'bullmq';
import { AuthenticationMicroservice } from 'apps/notification/src/microservices/services/authentication.microservice';

@QueueEventsListener(QueueName)
export class MailQueueEventListener extends QueueEventsHost {
  constructor(
    @InjectQueue(QueueName) private readonly mailQueue: Queue<MessageData, any, MessageType>,
    private readonly authenticationMicroservice: AuthenticationMicroservice,
  ) {
    super();
  }

  @OnQueueEvent('failed')
  async onQueueFailed(failedJob: { jobId: string }) {
    const job = await this.mailQueue.getJob(failedJob.jobId);
    switch (job.name) {
      case MessageType.SEND_VERIFYCATION_EMAIL: {
        this.handleSendVerificationEmailFailed(job.data.email);
      }
    }
  }

  handleSendVerificationEmailFailed(email: string) {
    this.authenticationMicroservice.sendVerificationEmailFailed(email);
  }
}
