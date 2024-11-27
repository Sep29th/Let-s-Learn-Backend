import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from './services/mail.service';
import { MailProcessor } from './processors/mail.processor';
import { QueueName } from './interfaces/mail-queue';
import { MailQueueEventListener } from './events/mail-queue.event';
import { MailController } from './controllers/mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_SMTP_HOST'),
          port: configService.get<number>('MAIL_SMTP_PORT'),
          secure: false,
          auth: configService.get<string>('MAIL_SMTP_AUTH_USERNAME')
            ? { username: configService.get<string>('MAIL_SMTP_AUTH_USERNAME'), password: configService.get<string>('MAIL_SMTP_AUTH_PASSWORD') }
            : null,
          pool: true,
          maxConnections: configService.get<number>('MAIL_SMTP_MAX_CONNECTION'),
          maxMessages: configService.get<number>('MAIL_SMTP_MAX_MESSAGE'),
          rateLimit: configService.get<number>('MAIL_SMTP_RATE_LIMIT'),
        },
        defaults: {
          from: `"Let's Learn" <ro-reply@letlearn.sep29th.online>`,
        },
        template: {
          dir: join(__dirname, 'modules/mail/templates'),
          adapter: new EjsAdapter({ inlineCssEnabled: true }),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: QueueName,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: 50,
          attempts: configService.get<number>('MAIL_QUEUE_ATTEMPTS'),
          backoff: { type: 'exponential', delay: configService.get<number>('MAIL_QUEUE_BACKOFF_DELAY') },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor, MailQueueEventListener],
})
export class MailModule {}
