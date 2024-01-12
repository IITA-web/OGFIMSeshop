import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Please enter a valid credential' })
  @IsString({ message: 'Please enter a valid credential' })
  readonly emailOrPhone: string;

  @IsNotEmpty({ message: 'Please enter a valid credential' })
  @IsString({ message: 'Please enter a valid credential' })
  @MinLength(6)
  readonly password: string;
}
