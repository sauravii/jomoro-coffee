import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsInt, Min, Max, IsOptional, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

export function IsAtLeastThreeWords(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAtLeastThreeWords',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return value.trim().split(/\s+/).length >= 3;
        },
        defaultMessage(args: ValidationArguments) { return `${args.property} must contain at least 3 words.`; }
      },
    });
  };
}

export class CreateProductDto {
  @IsNotEmpty() 
  @IsString() 
  @IsAtLeastThreeWords() 
  @ApiProperty()
  name: string;

  @IsNotEmpty() 
  @IsString() 
  @MinLength(20) 
  @ApiProperty()
  description: string;

  @IsNotEmpty() 
  @IsInt() 
  @Min(1) 
  @ApiProperty()
  price: number;

  @IsNotEmpty() 
  @IsInt() 
  @Min(0) 
  @ApiProperty()
  @Max(999) 
  stock: number;

  @IsOptional() 
  @IsString() 
  @ApiProperty()
  image_url?: string;

  @IsNotEmpty() 
  @IsInt() 
  @ApiProperty()
  category_id: number;
}