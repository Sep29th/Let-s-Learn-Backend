import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('MAIL') private readonly mailQueue: Queue) {}

  async sendEmail(): Promise<void> {
    await this.mailQueue.add('send-one', { code: '123546', email: 'caulata1234@gmail.com' });
  }
}
