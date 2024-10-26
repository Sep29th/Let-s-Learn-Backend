import { ExecutionContext, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '@app/module';
import { ThrottlerLimitDetail, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from './mongo/mongo.module';
import { AuthModule } from './modules/auth/auth.module';
import { MicroserviceModule } from './microservices/microservice.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          { name: 'short', ttl: configService.get<number>('SHORT_TTL', 1000), limit: configService.get<number>('SHORT_LIMIT', 3) },
          { name: 'medium', ttl: configService.get<number>('MEDIUM_TTL', 10000), limit: configService.get<number>('MEDIUM_LIMIT', 20) },
          { name: 'long', ttl: configService.get<number>('LONG_TTL', 60000), limit: configService.get<number>('LONG_LIMIT', 100) },
        ],
        errorMessage: (_: ExecutionContext, __: ThrottlerLimitDetail) => `CM0001`,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_MONGODB_URI'),
        dbName: configService.get<string>('DATABASE_MONGODB_DB'),
        auth: { username: configService.get<string>('DATABASE_MONGODB_USER'), password: configService.get<string>('DATABASE_MONGODB_PASS') },
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MicroserviceModule.forRoot(),
    CommonModule.forRoot(),
    MongoModule,
    AuthModule,
  ],
})
export class AppModule {}
