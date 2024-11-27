import { IAccessTokenPayload } from './access-token-payload.type';

export interface IAccessTokenValidatedPayload {
  user: { payload: IAccessTokenPayload };
}
