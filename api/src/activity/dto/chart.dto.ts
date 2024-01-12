import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChartDto {
  @IsNotEmpty()
  @IsString()
  readonly product: string;

  @IsNotEmpty()
  @IsNumber()
  readonly range: number;
}
