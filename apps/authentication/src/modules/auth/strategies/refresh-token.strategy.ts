import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { IRefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'REFRESH_TOKEN') {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Refresh'),
      secretOrKey: configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
      algorithms: ['RS512'],
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(request: Request, payload: IRefreshTokenPayload) {
    const token = request.get('authorization')?.replace('Refresh ', '');
    return { payload: payload, token: token };
  }
}
