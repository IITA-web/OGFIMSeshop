import { IsNotEmpty, IsString } from 'class-validator';

export class CallbackDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly vendor: string;

  @IsNotEmpty()
  @IsString()
  readonly product: string;
}
