import * as dotenv from 'dotenv';
dotenv.config({ path: ['dist/apps/authentication/.env', '.env'] });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';
import { MicroserviceOptions } from '@nestjs/microservices';
import authentication from 'service-info/service-info/authentication';
import { ConfigService } from '@nestjs/config';
import { ResponseApiFormatInterceptor } from '@app/module/response-api-format/response-api-format.interceptor';
import { ResponseApiFormatFilter } from '@app/module/response-api-format/response-api-format.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalInterceptors(new ResponseApiFormatInterceptor());
  app.useGlobalFilters(new ResponseApiFormatFilter());
  app.use(compression());
  app.use(helmet());
  app.enableVersioning({ type: VersioningType.URI });
  app.connectMicroservice<MicroserviceOptions>(authentication.async);
  app.startAllMicroservices();
  await app.listen(configService.get<string>('HTTP_PORT_AUTHENTICATION'));
}
bootstrap();
// caching, log
