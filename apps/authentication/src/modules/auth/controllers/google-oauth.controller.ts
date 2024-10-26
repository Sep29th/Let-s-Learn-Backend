import { Controller } from '@nestjs/common';
import { GoogleOauthService } from '../services/google-oauth.service';

@Controller({ path: 'oauth/google', version: '1' })
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}
}
