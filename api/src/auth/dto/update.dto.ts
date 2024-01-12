import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVendorDto {
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @IsNotEmpty()
  readonly tags: string[];

  @IsOptional()
  @IsString({ message: 'Profile image must be a valid string' })
  readonly image?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a valid string' })
  readonly bio?: string;
}
