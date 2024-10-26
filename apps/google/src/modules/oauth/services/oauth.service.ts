import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGoogleClientRequest, IGoogleUserResourceInfo } from 'proto/proto/generated/google';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IGoogleTokenResponse } from '../interfaces/google-token-response.interface';

@Injectable()
export class OauthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getToken(args: IGoogleClientRequest): Observable<AxiosResponse<IGoogleTokenResponse>> {
    return this.httpService.post<IGoogleTokenResponse>(this.configService.get<string>('OAUTH_TOKEN_URI', 'https://oauth2.googleapis.com/token'), {
      ...args,
      client_id: this.configService.get<string>('OAUTH_CLIENT_ID'),
      client_secret: this.configService.get<string>('OAUTH_CLIENT_SECRET'),
      redirect_uri: this.configService.get<string>('OAUTH_REDIRECT_URI'),
      grant_type: 'authorization_code',
    });
  }

  getUserInfo(args: IGoogleTokenResponse): Observable<AxiosResponse<IGoogleUserResourceInfo>> {
    return this.httpService.get<IGoogleUserResourceInfo>(this.configService.get<string>('OAUTH_USER_INFO_URI', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json'), {
      headers: {
        Authorization: `${args.token_type} ${args.access_token}`,
      },
    });
  }
}
