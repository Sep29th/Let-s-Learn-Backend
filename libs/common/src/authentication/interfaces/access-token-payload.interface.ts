import { RoleType } from 'apps/authentication/src/mongo/authentication/authentication.schema';

export interface IAccessTokenPayload {
  authenticationId: string;
  roles: RoleType;
}
