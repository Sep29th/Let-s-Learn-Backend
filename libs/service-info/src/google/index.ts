import { Transport } from '@nestjs/microservices';
import { join, resolve } from 'path';
import { GOOGLE_PACKAGE_NAME } from 'proto/proto/generated/google';
import { IConfigService } from '../interfaces';

export default {
  sync: {
    transport: Transport.GRPC,
    options: {
      package: GOOGLE_PACKAGE_NAME,
      protoPath: join(resolve(__dirname, '..', '..', '..'), 'libs/proto/src/protoc/google.proto'),
      url: `${process.env.GOOGLE_GRPC_HOST}:${process.env.GOOGLE_GRPC_PORT}`,
      loader: {
        keepCase: true,
      },
    },
  },
  async: {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${process.env.KAFKA1_HOST}:${process.env.KAFKA1_PORT}`, `${process.env.KAFKA2_HOST}:${process.env.KAFKA2_PORT}`, `${process.env.KAFKA3_HOST}:${process.env.KAFKA3_PORT}`],
        clientId: 'google',
        retry: { retries: 3, initialRetryTime: 300, factor: 2 },
      },
      consumer: {
        groupId: 'google-consumer',
        retry: { retries: 3, initialRetryTime: 5000, maxRetryTime: 60000, multiplier: 2 },
        allowAutoTopicCreation: true,
      },
    },
  },
} as IConfigService;
