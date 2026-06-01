import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductClientService } from '../common/product-client.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productClient: ProductClientService,
  ) {}

  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
      });
    }

    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return { cart_id: cart?.id ?? null, items: [] };
    }

    const itemsWithDetail = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productClient.getProductById(item.product_id);
        return {
          id: item.id,
          product_id: item.product_id,
          name: product?.name ?? 'Unknown',
          price: product?.price ?? 0,
          quantity: item.quantity,
        };
      }),
    );

    return { cart_id: cart.id, items: itemsWithDetail };
  }

  async addItem(userId: number, dto: AddCartDto) {
    const product = await this.productClient.getProductById(dto.product_id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });

    if (existingItem) {
      throw new BadRequestException('Product already exists in cart');
    }

    await this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });

    return { message: 'Item added to cart successfully' };
  }

  async updateItem(userId: number, productId: number, dto: UpdateCartDto) {
    const product = await this.productClient.getProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });

    return { message: 'Cart item updated successfully' };
  }

  async deleteItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.prisma.cartItem.delete({ where: { id: item.id } });

    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Cart cleared successfully' };
  }
}