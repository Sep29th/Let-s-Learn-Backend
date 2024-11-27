import { DynamicModule, Module } from '@nestjs/common';
import { GoogleMicroservice } from './services/google.microservice';
import { ClientsModule } from '@nestjs/microservices';
import google from 'service-info/service-info/google';
import notification from 'service-info/service-info/notification';
import { NotificationMicroservice } from './services/notification.microservice';

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
        ClientsModule.register([
          {
            name: 'NOTIFICATION_SERVICE_ASYNC',
            ...notification.async,
          },
        ]),
      ],
      providers: [GoogleMicroservice, NotificationMicroservice],
      exports: [GoogleMicroservice, NotificationMicroservice],
    };
  }
}
