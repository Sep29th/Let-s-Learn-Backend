import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CredentialService } from '../services/credential.service';
import { AccessTokenGuard } from '@app/module/authentication/guards/access-token.guard';
import { Request } from 'express';
import { IAccessTokenValidatedPayload } from '../types/access-token-validated-payload.type';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Topic, IPatternFailedSendVerificationEmailPayload } from 'kafka/event-message/authentication';
import { SignUpDTO } from '../dto/sign-up.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SignInDTO } from '../dto/sign-in.dto';
import { VerifyEmailDTO } from '../dto/verify-email.dto';
import { ChangePasswordDTO } from '../dto/change-password.dto';
import { ForgotPasswordDTO } from '../dto/forgot-password.dto';
import { SubmitForgotPasswordDTO } from '../dto/submit-forgot-password.dto';

@Controller({ path: 'auth/credential', version: '1' })
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post('sign-in')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe())
  async signIn(@Body() signInDto: SignInDTO) {
    return await this.credentialService.signIn(signInDto);
  }

  @Post('forgot-password')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe())
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    return await this.credentialService.forgotPassword(forgotPasswordDto);
  }

  @Post('submit-forgot-password')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe())
  async submitForgotPassword(@Body() submitForgotPasswordDto: SubmitForgotPasswordDTO) {
    return await this.credentialService.submitForgotPassword(submitForgotPasswordDto);
  }

  @Post('change-password')
  @UsePipes(new ValidationPipe())
  @UseGuards(ThrottlerGuard, AccessTokenGuard)
  async changePassword(@Req() req: Request & IAccessTokenValidatedPayload, @Body() changePasswordDto: ChangePasswordDTO) {
    return await this.credentialService.changePassword({ authenticationId: req.user.payload.authenticationId, ...changePasswordDto });
  }

  @Post('sign-up')
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe())
  async signUp(@Body() signUpDto: SignUpDTO) {
    return await this.credentialService.signUp(signUpDto);
  }

  @Post('send-verification-email')
  @UseGuards(ThrottlerGuard, AccessTokenGuard)
  async sendVerificationEmail(@Req() req: Request & IAccessTokenValidatedPayload) {
    return await this.credentialService.sendVerifyEmail(req.user.payload.authenticationId);
  }

  @Post('verify-email')
  @UsePipes(new ValidationPipe())
  @UseGuards(ThrottlerGuard, AccessTokenGuard)
  async verifyEmail(@Req() req: Request & IAccessTokenValidatedPayload, @Body() verifyEmailDto: VerifyEmailDTO) {
    return await this.credentialService.verifyEmail(req.user.payload.authenticationId, verifyEmailDto.code);
  }

  @EventPattern(Topic.FailedSendVerificationEmail)
  async sendVerificationEmailFailed(@Payload() payload: IPatternFailedSendVerificationEmailPayload) {
    this.credentialService.sendVerificationEmailFailed(payload.data.email);
  }
}
