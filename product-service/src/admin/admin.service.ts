import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  updateProduct(id: number, dto: CreateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async reduceStock(id: number, dto: ReduceStockDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock or product not found.');
    }
    return this.prisma.product.update({ 
      where: { id }, 
      data: { stock: product.stock - dto.quantity } 
    });
  }

  deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}