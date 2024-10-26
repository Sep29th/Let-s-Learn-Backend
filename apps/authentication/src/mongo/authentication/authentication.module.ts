import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationRepositoryService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Authentication, AuthenticationSchema } from './authentication.schema';

@Module({})
export class AuthenticationRepositoryModule {
  static forRoot(): DynamicModule {
    return {
      imports: [MongooseModule.forFeature([{ name: Authentication.name, schema: AuthenticationSchema }])],
      providers: [AuthenticationRepositoryService],
      exports: [AuthenticationRepositoryService],
      module: AuthenticationRepositoryModule,
      global: true,
    };
  }
}
