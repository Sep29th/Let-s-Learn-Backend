import { IsNotEmpty, IsString } from 'class-validator';
import { ILoginWithGoogle } from '../types/login-with-google.type';

export class LoginWithGoogleDTO implements ILoginWithGoogle {
  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  @IsNotEmpty({ message: (validationArguments) => `${validationArguments.property}-AU0002` })
  code: string;

  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  scope: string;

  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  authuser: string;

  @IsString({ message: (validationArguments) => `${validationArguments.property}-AU0001` })
  prompt: string;

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
