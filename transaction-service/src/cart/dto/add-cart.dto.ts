import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddCartDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  product_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty()
  quantity: number;
}