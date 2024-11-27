import { Module } from '@nestjs/common';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { MicroserviceModule } from './microservices/microservice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: { host: configService.get<string>('REDIS_HOST'), port: configService.get<number>('REDIS_PORT'), db: configService.get<number>('REDIS_DB') },
      }),
    }),
    MicroserviceModule.forRoot(),
    MailModule,
  ],
})
export class AppModule {}
