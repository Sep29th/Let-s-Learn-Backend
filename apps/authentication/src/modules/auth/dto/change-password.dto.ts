import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { IChangePassword } from '../types/change-password.type';

export class ChangePasswordDTO implements Omit<IChangePassword, 'authenticationId'> {
  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0021` })
  @MinLength(6, { message: (validationArguments) => `${validationArguments.property}-AU0021` })
  @Matches(/(?=.*[A-Z])/, { message: (validationArguments) => `${validationArguments.property}-AU0021` })
  @Matches(/(?=.*\d)/, { message: (validationArguments) => `${validationArguments.property}-AU0021` })
  oldPassword: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  @MinLength(6, { message: (validationArguments) => `${validationArguments.property}-AU0011-6` })
  @Matches(/(?=.*[A-Z])/, { message: (validationArguments) => `${validationArguments.property}-AU0012` })
  @Matches(/(?=.*\d)/, { message: (validationArguments) => `${validationArguments.property}-AU0013` })
  newPassword: string;

  retypeNewPassword: string;
}
