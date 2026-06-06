import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddCartDto {
  @IsNotEmpty()
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}