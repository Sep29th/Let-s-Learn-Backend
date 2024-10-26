import * as dotenv from 'dotenv';
dotenv.config({ path: ['dist/apps/authentication/.env', '.env'] });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(compression());
  app.use(helmet());
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(process.env.HTTP_PORT_AUTHENTICATION);
}
bootstrap();
// caching, filter, interceptor, log
