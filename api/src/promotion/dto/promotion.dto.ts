import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PromotionDto {
  @IsNotEmpty()
  @IsString()
  readonly product: string;

  @IsNotEmpty()
  @IsString()
  readonly paystack_reference: string;

  @IsNotEmpty()
  @IsNumber()
  readonly cost: number;

  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @IsNotEmpty()
  @IsString()
  readonly type: string;
}

export class ClosePromotionDto {
  @IsNotEmpty()
  @IsString()
  readonly paystack_reference: string;
}
