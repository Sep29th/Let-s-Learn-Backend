import { DynamicModule, Module } from '@nestjs/common';
import { GoogleMicroservice } from './services/google.microservice';
import { ClientsModule } from '@nestjs/microservices';
import google from 'service-info/service-info/google';

@Module({})
export class MicroserviceModule {
  static forRoot(): DynamicModule {
    return {
      module: MicroserviceModule,
      global: true,
      imports: [
        ClientsModule.register([
          {
            name: 'GOOGLE_SERVICE_SYNC',
            ...google.sync,
          },
        ]),
      ],
      providers: [GoogleMicroservice],
      exports: [GoogleMicroservice],
    };
  }
}
