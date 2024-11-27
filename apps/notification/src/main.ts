import * as dotenv from 'dotenv';
dotenv.config({ path: ['dist/apps/notification/.env', '.env'] });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import notification from 'service-info/service-info/notification';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(notification.async);
  app.startAllMicroservices();
  await app.listen(process.env.HTTP_PORT_NOTIFICATION ?? 3001);
}
bootstrap();
