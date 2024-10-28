import { MailerService } from '@nestjs-modules/mailer';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('MAIL', { concurrency: 5, limiter: { max: 50, duration: 60000 }, maxStalledCount: 1 })
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'send-one': {
        await this.sendOne(job);
      }
    }
  }

  async sendOne(job: Job) {
    await this.mailerService.sendMail({ to: job.data.email, subject: 'Verify Code', text: 'This is text', template: 'verify', context: job.data });
  }
}
