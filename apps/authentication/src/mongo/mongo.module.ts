import { Module } from '@nestjs/common';
import { AuthenticationRepositoryModule } from './authentication/authentication.module';
import { TokenRepositoryModule } from './token/token.module';

@Module({
  imports: [AuthenticationRepositoryModule.forRoot(), TokenRepositoryModule.forRoot()],
})
export class MongoModule {}
