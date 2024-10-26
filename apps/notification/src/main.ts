import * as dotenv from 'dotenv';
dotenv.config({ path: ['dist/apps/notification/.env', '.env'] });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.HTTP_PORT_NOTIFICATION ?? 3001);
}
bootstrap();
