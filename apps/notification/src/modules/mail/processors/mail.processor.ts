import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueName, MessageType, ISendVerificationEmailData } from '../interfaces/mail-queue';

@Processor(QueueName, { concurrency: 5, limiter: { max: 50, duration: 60000 }, maxStalledCount: 1 })
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case MessageType.SEND_VERIFYCATION_EMAIL: {
        await this.sendVerificationEmailProcess(job);
      }
    }
  }

  async sendVerificationEmailProcess(job: Job<ISendVerificationEmailData>) {
    await this.mailerService.sendMail({ to: job.data.email, subject: 'Verify Your Email', template: 'verify', context: job.data });
  }
}
