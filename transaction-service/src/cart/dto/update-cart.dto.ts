import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty()
  quantity: number;
}