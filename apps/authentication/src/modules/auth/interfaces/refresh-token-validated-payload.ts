import { IRefreshTokenPayload } from './refresh-token-payload.interface';

export interface IRefreshTokenValidatedPayload {
  user: { payload: IRefreshTokenPayload; token: string };
}
