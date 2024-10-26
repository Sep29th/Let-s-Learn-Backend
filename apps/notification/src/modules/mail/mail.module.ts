import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { TestController } from './controllers/test.controller';
import { MailService } from './services/mail.service';
import { MailConsumer } from './processors/mail.processor';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: '127.0.0.1',
          port: 1025,
          secure: false,
          auth: null,
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          rateLimit: 10,
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
    BullModule.registerQueue({
      name: 'MAIL',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 50,
        attempts: 3,
        backoff: { type: 'fixed', delay: 1000 },
      },
    }),
  ],
  controllers: [TestController],
  providers: [MailService, MailConsumer],
})
export class MailModule {}
