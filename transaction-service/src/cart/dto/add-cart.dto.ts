import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class AddCartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  product_id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}