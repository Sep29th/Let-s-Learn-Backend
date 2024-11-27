import { RoleType } from 'apps/authentication/src/mongo/authentication/authentication.schema';
import { IDeviceInfo } from './device-info.type';

interface ISignUpBase {
  email: string;
  name: string;
  nickname?: string;
  phoneNumber?: string;
  password: string;
  roles: RoleType;
}

export type ISignUp = ISignUpBase & IDeviceInfo;
