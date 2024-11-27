import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationRepositoryService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Authentication, AuthenticationSchema } from './authentication.schema';
import { CacheModule } from '@app/module/cache/cache.module';

@Module({})
export class AuthenticationRepositoryModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        MongooseModule.forFeature([{ name: Authentication.name, schema: AuthenticationSchema }]),
        CacheModule.forRoot({
          isGlobal: false,
          cacheType: 'local',
          provider: 'authentication',
          nonBlocking: true,
          options: { ttl: 60000, lruSize: 5000 },
        }),
      ],
      providers: [AuthenticationRepositoryService],
      exports: [AuthenticationRepositoryService],
      module: AuthenticationRepositoryModule,
      global: true,
    };
  }
}
