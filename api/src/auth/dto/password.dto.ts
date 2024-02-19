import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Please enter your email address or phone number' })
  @IsString()
  readonly emailOrPhone: string;
}

export class ResetPasswordDto extends ForgotPasswordDto {
  @IsNotEmpty({ message: 'Reset token is empty' })
  @IsString()
  readonly resetToken: string;

  @IsNotEmpty({ message: 'Password is empty' })
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is empty' })
  @IsString()
  readonly currentPassword: string;

  @IsNotEmpty({ message: 'New password is empty' })
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
