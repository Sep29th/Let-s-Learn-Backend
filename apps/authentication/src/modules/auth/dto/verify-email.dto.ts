import { IsNumberString, Length } from 'class-validator';

export class VerifyEmailDTO {
  @IsNumberString(undefined, { message: (validationArguments) => `${validationArguments.property}-AU0024` })
  @Length(6, 6)
  code: string;
}
