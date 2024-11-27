import { Body, Controller, Post } from '@nestjs/common';
import { GoogleOauthService } from '../services/google-oauth.service';
import { LoginWithGoogleDTO } from '../dto/login-with-google.dto';

@Controller({ path: 'auth/oauth/google', version: '1' })
export class GoogleOauthController {
  constructor(private readonly googleOauthService: GoogleOauthService) {}

  @Post('sign-in')
  async signIn(@Body() loginWithGoogleDto: LoginWithGoogleDTO) {
    return await this.googleOauthService.signIn(loginWithGoogleDto);
  }
}
