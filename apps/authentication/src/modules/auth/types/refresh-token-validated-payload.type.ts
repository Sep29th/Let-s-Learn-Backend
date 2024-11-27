import { IRefreshTokenPayload } from './refresh-token-payload.type';

export interface IRefreshTokenValidatedPayload {
  user: { payload: IRefreshTokenPayload; token: string };
}
