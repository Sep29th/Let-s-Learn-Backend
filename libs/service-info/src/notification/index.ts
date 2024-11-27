import { Transport } from '@nestjs/microservices';
import { IConfigService } from '../interfaces';

export default {
  async: {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA1_HOST}:${process.env.KAFKA1_PORT}`, `${process.env.KAFKA2_HOST}:${process.env.KAFKA2_PORT}`, `${process.env.KAFKA3_HOST}:${process.env.KAFKA3_PORT}`],
        clientId: 'notification',
        retry: { retries: 3, initialRetryTime: 300, factor: 2 },
      },
      consumer: {
        groupId: 'notification-consumer',
        retry: { retries: 3, initialRetryTime: 5000, maxRetryTime: 60000, multiplier: 2 },
        allowAutoTopicCreation: true,
      },
    },
  },
} as IConfigService;
