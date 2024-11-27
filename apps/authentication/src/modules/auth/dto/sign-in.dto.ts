import { isEmail, IsNotEmpty, isPhoneNumber, IsString, Matches, MinLength, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ISignIn } from '../types/sign-in.type';

@ValidatorConstraint({ name: 'isEmailOrPhoneNumber', async: false })
class IsEmailOrPhoneNumber implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    return isEmail(value) || isPhoneNumber(value);
  }
  defaultMessage?(validationArguments?): string {
    return `${validationArguments.property}-AU0022`;
  }
}

export class SignInDTO implements ISignIn {
  @Validate(IsEmailOrPhoneNumber)
  emailOrPhoneNumber: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0021` })
  @MinLength(6, { message: (validationArguments) => `${validationArguments.property}-AU0021` })
  @Matches(/(?=.*[A-Z])/, { message: (validationArguments) => `${validationArguments.property}-AU0021` })
  @Matches(/(?=.*\d)/, { message: (validationArguments) => `${validationArguments.property}-AU0021` })
  password: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  // @IsFirebasePushId({ message: (validationArguments) => `${validationArguments.property}-AU0016` })
  deviceToken: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  OS: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  platform: string;
}
