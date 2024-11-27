import { IForgotPassword } from '../types/forgot-password.type';
import { isEmail, isPhoneNumber, isString, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isEmailOrPhoneNumberOrNickname', async: false })
class IsEmailOrPhoneNumberOrNickname implements ValidatorConstraintInterface {
  validate(value: any): Promise<boolean> | boolean {
    return isEmail(value) || isPhoneNumber(value) || (isString(value) && value.charAt(0) == '@');
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property}-AU0029`;
  }
}

export class ForgotPasswordDTO implements IForgotPassword {
  @Validate(IsEmailOrPhoneNumberOrNickname)
  emailOrPhoneNumberOrNickname: string;
}
