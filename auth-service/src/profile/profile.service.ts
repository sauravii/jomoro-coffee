import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        role: true,
      },
    });

    return { 
      status: 200, 
      message: "User profile fetched successfully",
      data: user 
    };
  }
}