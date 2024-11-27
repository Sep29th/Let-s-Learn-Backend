import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GOOGLE_SERVICE_NAME, GoogleServiceController, IGoogleClientRequest, IGoogleUserResourceInfo } from 'proto/proto/generated/google';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OauthService } from '../services/oauth.service';

@Controller('oauth')
export class OauthController implements GoogleServiceController {
  constructor(private readonly oauthService: OauthService) {}

  @GrpcMethod(GOOGLE_SERVICE_NAME)
  loginWithGoogle(data: IGoogleClientRequest): Observable<IGoogleUserResourceInfo> {
    return this.oauthService.getToken(data).pipe(switchMap((tokenResponse) => this.oauthService.getUserInfo(tokenResponse.data).pipe(map((userInfoResponse) => userInfoResponse.data))));
  }
}
