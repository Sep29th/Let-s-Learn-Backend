import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenRepositoryService } from 'apps/authentication/src/mongo/token/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('REFRESH_TOKEN') implements CanActivate {
  constructor(protected tokenRepository: TokenRepositoryService) {
    super();
  }
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    const req = context.switchToHttp().getRequest();
    const refreshToken = req.headers['authorization']?.replace('Refresh ', '');
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        this.tokenRepository.deleteTokenByRefreshToken(refreshToken);
        throw new UnauthorizedException('AU0003');
      } else if (info?.name === 'JsonWebTokenError') throw new UnauthorizedException('AU0004');
      else throw new UnauthorizedException('AU0005');
    }
    return user;
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
