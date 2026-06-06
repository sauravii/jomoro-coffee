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
  name: string;

  @IsNotEmpty() 
  @IsString() 
  @MinLength(20) 
  description: string;

  @IsNotEmpty() 
  @IsInt() 
  @Min(1) 
  price: number;

  @IsNotEmpty() 
  @IsInt() 
  @Min(0) 
  @Max(999) 
  stock: number;

  @IsOptional() 
  @IsString() 
  image_url?: string;

  @IsNotEmpty() 
  @IsInt() 
  category_id: number;
}