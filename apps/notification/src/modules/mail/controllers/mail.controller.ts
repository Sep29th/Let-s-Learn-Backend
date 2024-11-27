import { Controller } from '@nestjs/common';
import { EventPattern, KafkaRetriableException, Payload } from '@nestjs/microservices';
import { IPatternMailPayload, MailType, Topic } from 'kafka/event-message/notification';
import { MailService } from '../services/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern(Topic.Mail)
  async sendMail(@Payload() payload: IPatternMailPayload) {
    try {
      switch (payload.mailType) {
        case MailType.VERIFYCATION_EMAIL: {
          await this.mailService.sendVerificationEmail({ email: payload.targetEmail, ...payload.data });
        }
      }
    } catch (error) {
      throw new KafkaRetriableException(error);
    }
  }
}
