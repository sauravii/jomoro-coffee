import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private _prisma: PrismaService,
    private _jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this._prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const user = await this._prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password: dto.password,
        role: 'CUSTOMER',
      },
    });

    return { 
      status: 200,
      message: 'User registered successfully',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      }
    };
  }

  async login(dto: LoginDto) {
    const user = await this._prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    if (dto.password !== user.password) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: user.id, role: user.role };
    const token = this._jwtService.sign(payload);

    return { 
      status: 200, 
      message: "User login successfully",
      access_token: token };
  }
}