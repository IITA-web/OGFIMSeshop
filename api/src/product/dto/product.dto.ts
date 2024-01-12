import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(100)
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsOptional()
  @IsString()
  readonly sub_category: string;

  @IsNotEmpty()
  @IsString()
  readonly local_goverment: string;

  @IsOptional()
  @IsBoolean()
  readonly is_service: boolean;

  @IsOptional()
  @IsString()
  readonly billing_type: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly is_negotiable: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly show_phone_number: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly show_email: boolean;

  @IsNotEmpty()
  @IsBoolean()
  readonly show_whatsapp: boolean;

  @IsOptional()
  readonly images: {
    url: string;
    id: string;
  }[];

  @IsOptional()
  readonly slug: string;
}
