import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import authentication from 'service-info/service-info/authentication';
import { AuthenticationMicroservice } from './services/authentication.microservice';

@Module({})
export class MicroserviceModule {
  static forRoot(): DynamicModule {
    return {
      module: MicroserviceModule,
      global: true,
      imports: [
        ClientsModule.register([
          {
            name: 'AUTHENTICATION_SERVICE_ASYNC',
            ...authentication.async,
          },
        ]),
      ],
      providers: [AuthenticationMicroservice],
      exports: [AuthenticationMicroservice],
    };
  }
}
