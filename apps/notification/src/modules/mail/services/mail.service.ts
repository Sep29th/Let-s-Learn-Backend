import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName, MessageData, MessageType } from '../interfaces/mail-queue';

@Injectable()
export class MailService {
  constructor(@InjectQueue(QueueName) private readonly mailQueue: Queue<MessageData, any, MessageType>) {}

  async sendVerificationEmail(content: MessageData): Promise<void> {
    await this.mailQueue.add(MessageType.SEND_VERIFYCATION_EMAIL, content);
  }
}
