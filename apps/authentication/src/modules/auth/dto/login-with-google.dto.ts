import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { IGoogleClientRequest } from 'proto/proto/generated/google';

export class LoginWithGoogleDTO implements IGoogleClientRequest {
  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property}-AU0001` })
  @IsNotEmpty({ message: (validationArguments: ValidationArguments) => `${validationArguments.property}-AU0002` })
  code: string;

  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property}-AU0001` })
  scope: string;

  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property}-AU0001` })
  authuser: string;

  @IsString({ message: (validationArguments: ValidationArguments) => `${validationArguments.property}-AU0001` })
  prompt: string;
}
