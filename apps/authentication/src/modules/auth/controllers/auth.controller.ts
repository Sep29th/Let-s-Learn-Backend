import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Auth } from '../classes/auth.class';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { Request } from 'express';
import { IRefreshTokenValidatedPayload } from '../types/refresh-token-validated-payload.type';
import { AccessTokenGuard } from '@app/module/authentication/guards/access-token.guard';
import { IAccessTokenValidatedPayload } from '../types/access-token-validated-payload.type';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(@Inject(Auth) private readonly authService: Auth) {}

  @Post('sign-out')
  @UseGuards(RefreshTokenGuard)
  async signOut(@Req() request: Request & IRefreshTokenValidatedPayload) {
    return await this.authService.signOut(request.user.token);
  }

  @Post('sign-out-of-all-other-devices')
  @UseGuards(RefreshTokenGuard)
  async signOutOfAllOtherDevices(@Req() request: Request & IRefreshTokenValidatedPayload) {
    return await this.authService.signOutOfAllOtherDevices(request.user.token, request.user.payload);
  }

  @Post('sign-out-other-device')
  @UseGuards(AccessTokenGuard)
  async signOutOtherDevice(@Body() deviceRefreshToken: string) {
    return await this.authService.signOutOtherDevice(deviceRefreshToken);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() request: Request & IRefreshTokenValidatedPayload) {
    return await this.authService.refreshToken(request.user.token, request.user.payload);
  }

  @Post('verify-phonenumber')
  @UseGuards(AccessTokenGuard)
  async verifyPhonenumber(@Req() request: Request & IAccessTokenValidatedPayload) {
    return await this.authService.verifyPhonenumber(request.user.payload.authenticationId);
  }
}
