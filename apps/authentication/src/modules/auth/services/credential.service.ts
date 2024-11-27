import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Auth } from '../classes/auth.class';
import { Observable } from 'rxjs';
import { IToken } from '../types/token.type';
import { AuthenticationRepositoryService } from 'apps/authentication/src/mongo/authentication/authentication.service';
import { TokenRepositoryService } from 'apps/authentication/src/mongo/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountType, Authentication, Status } from 'apps/authentication/src/mongo/authentication/authentication.schema';
import { CacheService } from '@app/module/cache/interfaces';
import { InjectCache } from '@app/module/cache/decorators/inject-cache.decorator';
import { REDIS_PROVIDE } from '@app/module/cache/constants';
import { NotificationMicroservice } from 'apps/authentication/src/microservices/services/notification.microservice';
import { ISignUp } from '../types/sign-up.type';
import * as bcrypt from 'bcrypt';
import { IRefreshTokenPayload } from '../types/refresh-token-payload.type';
import { IAccessTokenPayload } from '../types/access-token-payload.type';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ISignIn } from '../types/sign-in.type';
import { IChangePassword } from '../types/change-password.type';
import { IForgotPassword } from '../types/forgot-password.type';
import { v4 as uuidv4 } from 'uuid';
import { ISubmitForgotPassword } from '../types/submit-forgot-password.type';

@Injectable()
export class CredentialService extends Auth {
  constructor(
    @InjectCache(REDIS_PROVIDE) private readonly cacheRedisService: CacheService,
    protected readonly authenticationRepository: AuthenticationRepositoryService,
    protected readonly tokenRepository: TokenRepositoryService,
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    private readonly notificationMicroservice: NotificationMicroservice,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super(authenticationRepository, tokenRepository, configService, jwtService);
  }

  async signIn(signInInfo: ISignIn): Promise<IToken | Observable<IToken>> {
    const auth = await this.authenticationRepository.getAuthenticationByEmailOrPhoneNumber(signInInfo.emailOrPhoneNumber);
    if (!auth || !(await bcrypt.compare(signInInfo.password, auth.password))) throw new BadRequestException(`AU00021`);
    this.checkAuthenticationStatus(auth.status, [Status.DELETED, Status.LOCKED]);
    const [newRefreshToken, newAccessToken] = await Promise.all([
      this.jwtService.signAsync({ authenticationId: auth._id.toString() } as IRefreshTokenPayload, {
        algorithm: 'RS512',
        expiresIn: '180d',
        secret: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
      }),
      this.jwtService.signAsync({ authenticationId: auth._id.toString(), roles: auth.roles } as IAccessTokenPayload, {
        algorithm: 'RS256',
        expiresIn: '4h',
        secret: this.configService.get<string>('JWT_ACCESS_PRIVATE_KEY'),
      }),
    ]);
    await this.tokenRepository.createTokenByRefreshToken({
      authentication_id: auth,
      refresh_token: newRefreshToken,
      device_token: signInInfo.deviceToken,
      OS: signInInfo.OS,
      platform: signInInfo.platform,
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(forgotPasswordInfo: IForgotPassword) {
    const auth = await this.authenticationRepository.getAuthenticationByEmailOrPhoneNumberOrNickname(forgotPasswordInfo.emailOrPhoneNumberOrNickname, AccountType.CREDENTIAL);
    let uuid = uuidv4();
    await this.cacheRedisService.set(`fgpw:${uuid}`, auth._id.toString(), 5 * 60 * 1000);
    return uuid;
  }

  async submitForgotPassword(submitForgotPasswordInfo: ISubmitForgotPassword) {
    const authId = await this.cacheRedisService.get<string>(`fgpw:${submitForgotPasswordInfo.uuidRequest}`);
    if (!authId) throw new BadRequestException(`AU0030`);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await Promise.all([
        this.authenticationRepository.updateAuthentication(
          { _id: authId },
          { password: await bcrypt.hash(submitForgotPasswordInfo.newPassword, this.configService.get<string>('HASH_SALT')) },
          { session },
        ),
        this.tokenRepository.deleteManyTokenByAuthenticationId(authId, undefined, { session }),
      ]);
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      return false;
    } finally {
      session.endSession();
    }
  }

  async changePassword(changePasswordInfo: IChangePassword) {
    if (changePasswordInfo.newPassword == changePasswordInfo.oldPassword) throw new BadRequestException(`AU0026`);
    if (changePasswordInfo.newPassword != changePasswordInfo.retypeNewPassword) throw new BadRequestException(`AU0027`);
    const auth = await this.authenticationRepository.getAuthenticationById(changePasswordInfo.authenticationId);
    if (auth.password != changePasswordInfo.oldPassword) throw new BadRequestException(`AU0028`);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await Promise.all([
        this.authenticationRepository.updateAuthentication(
          { _id: auth._id },
          { password: await bcrypt.hash(changePasswordInfo.newPassword, this.configService.get<string>('HASH_SALT')) },
          { session },
        ),
        this.tokenRepository.deleteManyTokenByAuthenticationId(auth._id.toString(), undefined, { session }),
      ]);
      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      return false;
    } finally {
      session.endSession();
    }
  }

  async signUp(signUpInfo: ISignUp): Promise<IToken> {
    const checkExist = await this.authenticationRepository.getAuthenticationByEmailAndAccountTypeOrNicknameOrPhoneNumber(
      signUpInfo.email,
      AccountType.CREDENTIAL,
      signUpInfo.nickname,
      signUpInfo.phoneNumber,
    );
    if (checkExist) {
      if (checkExist.email == signUpInfo.email) throw new ConflictException('AU0014');
      if (checkExist.nickname == `@${signUpInfo.nickname}`) throw new ConflictException('AU0018');
      if (checkExist.phone_number == signUpInfo.phoneNumber) throw new ConflictException('AU0020');
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      let createSignUpInfo: Partial<Authentication> = {
        email: signUpInfo.email,
        roles: signUpInfo.roles,
        name: signUpInfo.name,
        account_type: AccountType.CREDENTIAL,
        password: await bcrypt.hash(signUpInfo.password, this.configService.get<string>('HASH_SALT')),
      };
      if (signUpInfo.nickname) createSignUpInfo['nickname'] = `@${signUpInfo.nickname}`;
      if (signUpInfo.phoneNumber) createSignUpInfo['phone_number'] = signUpInfo.phoneNumber;
      const auth = await this.authenticationRepository.createAuthentication(createSignUpInfo, { session });
      const [newRefreshToken, newAccessToken] = await Promise.all([
        this.jwtService.signAsync({ authenticationId: auth._id.toString() } as IRefreshTokenPayload, {
          algorithm: 'RS512',
          expiresIn: '180d',
          secret: this.configService.get<string>('JWT_REFRESH_PRIVATE_KEY'),
        }),
        this.jwtService.signAsync({ authenticationId: auth._id.toString(), roles: auth.roles } as IAccessTokenPayload, {
          algorithm: 'RS256',
          expiresIn: '4h',
          secret: this.configService.get<string>('JWT_ACCESS_PRIVATE_KEY'),
        }),
      ]);
      await this.tokenRepository.createTokenByRefreshToken(
        {
          authentication_id: auth,
          refresh_token: newRefreshToken,
          device_token: signUpInfo.deviceToken,
          OS: signUpInfo.OS,
          platform: signUpInfo.platform,
        },
        { session },
      );
      await session.commitTransaction();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async sendVerifyEmail(authenticationId: string): Promise<boolean> {
    const auth = await this.authenticationRepository.getAuthenticationById(authenticationId);
    this.checkAuthenticationStatus(auth.status, [Status.DELETED, Status.LOCKED]);
    if (auth.email_verified) throw new BadRequestException(`AU0023`);
    let code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    await this.cacheRedisService.set(`mail:verify:${auth.email}`, code, 10 * 60 * 1000);
    this.notificationMicroservice.sendVerificationEmail(auth.email, code, 10 * 60 * 1000);
    return true;
  }

  async verifyEmail(authenticationId: string, code: string): Promise<boolean> {
    const auth = await this.authenticationRepository.getAuthenticationById(authenticationId);
    const otpSend = await this.cacheRedisService.get(`mail:verify:${auth.email}`);
    if (!otpSend || otpSend != code) throw new BadRequestException('AU0025');
    let update: any = { email_verified: true };
    if (auth.phone_number_verified) update['status'] = Status.ACTIVE;
    await Promise.all([this.cacheRedisService.del(`mail:verify:${auth.email}`), this.authenticationRepository.updateAuthentication({ _id: auth._id }, update)]);
    return true;
  }

  async sendVerificationEmailFailed(email: string): Promise<void> {
    await this.cacheRedisService.del(`mail:verify:${email}`);
  }
}
