import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { IAccessTokenPayload } from '../interfaces/access-token-payload.interface';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'ACCESS_TOKEN') {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_PUBLIC_KEY'),
      algorithms: ['RS256'],
    } as StrategyOptions);
  }

  async validate(payload: IAccessTokenPayload) {
    return { payload: payload };
  }
}
