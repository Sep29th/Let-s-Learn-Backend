import { IGoogleClientRequest } from 'proto/proto/generated/google';
import { IDeviceInfo } from './device-info.type';

export type ILoginWithGoogle = IGoogleClientRequest & IDeviceInfo;
