import { RoleType } from 'apps/authentication/src/mongo/authentication/authentication.schema';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ISignUp } from '../types/sign-up.type';

@ValidatorConstraint({ name: 'isRoleType', async: false })
class IsRoleTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (Array.isArray(value)) {
      return value.every((item) => item === 'LEARNER' || item === 'TEACHER');
    }
    return value === 'ACADEMY';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property}-AU0015`;
  }
}

export class SignUpDTO implements ISignUp {
  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsEmail(undefined, { message: (validationArguments) => `${validationArguments.property}-AU0010` })
  email: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @MinLength(2, { message: (validationArguments) => `${validationArguments.property}-AU0011-2` })
  @MaxLength(25, { message: (validationArguments) => `${validationArguments.property}-AU0017-25` })
  name: string;

  @IsOptional()
  @MinLength(2, { message: (validationArguments) => `${validationArguments.property}-AU0011-2` })
  @MaxLength(25, { message: (validationArguments) => `${validationArguments.property}-AU0017-25` })
  nickname?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: (validationArguments) => `${validationArguments.property}-AU0019` })
  phoneNumber?: string;

  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  @MinLength(6, { message: (validationArguments) => `${validationArguments.property}-AU0011-6` })
  @Matches(/(?=.*[A-Z])/, { message: (validationArguments) => `${validationArguments.property}-AU0012` })
  @Matches(/(?=.*\d)/, { message: (validationArguments) => `${validationArguments.property}-AU0013` })
  password: string;

  @Validate(IsRoleTypeConstraint)
  roles: RoleType;

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
