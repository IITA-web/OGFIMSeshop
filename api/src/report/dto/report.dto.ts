import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  readonly vendor: string;

  @IsNotEmpty()
  @IsString()
  readonly reason: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly google_auth_id: string;
}
