import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { IGoogleClientRequest, GOOGLE_SERVICE_NAME, GoogleServiceClient, IGoogleUserResourceInfo } from 'proto/proto/generated/google';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleMicroservice implements OnModuleInit {
  private googleServiceSync: GoogleServiceClient;

  constructor(@Inject('GOOGLE_SERVICE_SYNC') private client: ClientGrpc) {}

  onModuleInit() {
    this.googleServiceSync = this.client.getService<GoogleServiceClient>(GOOGLE_SERVICE_NAME);
  }

  loginWithGoogle(args: IGoogleClientRequest): Observable<IGoogleUserResourceInfo> {
    return this.googleServiceSync.loginWithGoogle(args);
  }
}
