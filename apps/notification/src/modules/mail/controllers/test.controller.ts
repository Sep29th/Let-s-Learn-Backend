import { Controller, Get } from '@nestjs/common';
import { MailService } from '../services/mail.service';

@Controller()
export class TestController {
  constructor(private readonly mailService: MailService) {}
  @Get('send')
  process() {
    this.mailService.sendEmail();
  }
}
