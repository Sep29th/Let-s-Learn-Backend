import { Module } from '@nestjs/common';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: { host: '127.0.0.1', port: 6379 },
      }),
    }),
    MailModule,
  ],
})
export class AppModule {}
