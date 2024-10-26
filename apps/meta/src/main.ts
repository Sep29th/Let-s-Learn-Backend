import { NestFactory } from '@nestjs/core';
import { MetaModule } from './meta.module';

async function bootstrap() {
  const app = await NestFactory.create(MetaModule);
  await app.listen(3000);
}
bootstrap();
