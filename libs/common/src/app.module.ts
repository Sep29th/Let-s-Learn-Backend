import { DynamicModule, Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class CommonModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonModule,
      global: true,
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthenticationModule],
    };
  }
}
