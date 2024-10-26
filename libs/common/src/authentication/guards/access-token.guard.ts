import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard extends AuthGuard('ACCESS_TOKEN') implements CanActivate {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') throw new UnauthorizedException('AU0003');
      else if (info?.name === 'JsonWebTokenError') throw new UnauthorizedException('AU0004');
      else throw new UnauthorizedException('AU0005');
    }
    return user;
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
