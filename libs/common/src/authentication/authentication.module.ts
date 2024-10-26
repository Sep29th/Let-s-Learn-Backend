import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';

@Module({
  providers: [AccessTokenStrategy, AccessTokenGuard],
  exports: [AccessTokenStrategy, AccessTokenGuard],
})
export class AuthenticationModule {}
