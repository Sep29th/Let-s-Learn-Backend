// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.3
//   protoc               v5.28.2
// source: google.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'google';

export interface IGoogleClientRequest {
  code: string;
  scope: string;
  authuser: string;
  prompt: string;
}

export interface IGoogleUserResourceInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export const GOOGLE_PACKAGE_NAME = 'google';

export interface GoogleServiceClient {
  loginWithGoogle(request: IGoogleClientRequest): Observable<IGoogleUserResourceInfo>;
}

export interface GoogleServiceController {
  loginWithGoogle(request: IGoogleClientRequest): Observable<IGoogleUserResourceInfo>;
}

export function GoogleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['loginWithGoogle'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('GoogleService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('GoogleService', method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GOOGLE_SERVICE_NAME = 'GoogleService';