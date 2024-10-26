import * as dotenv from 'dotenv';
dotenv.config({ path: ['dist/apps/google/.env', '.env'] });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import google from 'service-info/service-info/google';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(google.sync);
  app.connectMicroservice<MicroserviceOptions>(google.async);
  await app.startAllMicroservices();
}
bootstrap();
