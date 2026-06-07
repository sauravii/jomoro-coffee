import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany({ include: { category: true } });
    return {
      status: 200,
      message: 'Products fetched successfully',
      data: products,
    };
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({ 
      where: { id }, include: { category: true } 
    });
    if (!product) throw new NotFoundException('Product not found');
    return {
      status: 200,
      message: 'Product fetched successfully',
      data: product,
    };
  }

  async getProductsByCategory(categoryId: number) {
    const products = await this.prisma.product.findMany({ where: { category_id: categoryId } });
    return {
      status: 200,
      message: 'Products by category fetched successfully',
      data: products,
    };
  }
}