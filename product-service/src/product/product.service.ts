import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  getAllProducts() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({ 
      where: { id }, include: { category: true } 
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  getProductsByCategory(categoryId: number) {
    return this.prisma.product.findMany({ where: { category_id: categoryId } });
  }
}