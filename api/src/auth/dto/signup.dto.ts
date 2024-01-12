import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({
    message: 'Please validate you have an account on the old platform',
  })
  @IsUUID('all')
  readonly main_app_vendor_id: string;

  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsOptional()
  readonly phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly image: string;

  @IsArray({
    message: 'Tags must be selected',
  })
  @ArrayMinSize(1, { message: 'Please add at least one tag' })
  @IsString({ each: true })
  readonly tags: string[];
}

export class AccountActivationDto {
  @IsNotEmpty()
  @IsString()
  readonly emailOrPhone: string;

  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
