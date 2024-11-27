import { IDeviceInfo } from './device-info.type';

interface ISignInBase {
  emailOrPhoneNumber: string;
  password: string;
}

export type ISignIn = ISignInBase & IDeviceInfo;
