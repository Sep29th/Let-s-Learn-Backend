import { DynamicModule, Module } from '@nestjs/common';
import { TokenRepositoryService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './token.schema';

@Module({})
export class TokenRepositoryModule {
  static forRoot(): DynamicModule {
    return {
      imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])],
      providers: [TokenRepositoryService],
      exports: [TokenRepositoryService],
      module: TokenRepositoryModule,
      global: true,
    };
  }
}
