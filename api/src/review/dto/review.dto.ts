import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  readonly google_auth_id: string;

  @IsNotEmpty()
  @IsString()
  readonly vendor: string;

  @IsNotEmpty()
  @IsNumber()
  readonly rating: number;

  @IsNotEmpty()
  @IsString()
  readonly comment: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
