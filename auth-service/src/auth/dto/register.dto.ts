import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'First name must contain letters only',
  })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Last name must contain letters only',
  })
  last_name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.(com|net|org|id)$/, {
    message: 'Email must end with .com, .net, .org, or .id',
  })
  email: string;

  @ApiProperty({ example: 'password12' })
  @IsString()
  @MinLength(8, { message: 'Password must have a minimum of 8 characters' })
  @Matches(/^(?=(?:.*\d){2})\S+$/, {
    message:
      'Password cannot contain spaces and must have at least 2 numeric digits',
  })
  password: string;
}