import { IsNotEmpty, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { ISubmitForgotPassword } from '../types/submit-forgot-password.type';

export class SubmitForgotPasswordDTO implements ISubmitForgotPassword {
  @IsUUID('4', { message: (validationArguments) => `${validationArguments.property}-AU0031` })
  uuidRequest: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  @MinLength(6, { message: (validationArguments) => `${validationArguments.property}-AU0011-6` })
  @Matches(/(?=.*[A-Z])/, { message: (validationArguments) => `${validationArguments.property}-AU0012` })
  @Matches(/(?=.*\d)/, { message: (validationArguments) => `${validationArguments.property}-AU0013` })
  newPassword: string;
}
