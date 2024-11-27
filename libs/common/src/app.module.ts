import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { ResponseApiFormatInterceptor } from './response-api-format/response-api-format.interceptor';
import { ResponseApiFormatFilter } from './response-api-format/response-api-format.filter';

@Module({})
export class CommonModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonModule,
      global: true,
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule],
      providers: [ResponseApiFormatInterceptor, ResponseApiFormatFilter],
    };
  }
}
