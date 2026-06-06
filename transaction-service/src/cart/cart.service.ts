import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async getCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
        include: { items: true },
      });
    }

    // Attach live product details to the cart items
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await this.productClient.getProduct(item.product_id);
          return { ...item, product };
        } catch (error) {
          return { ...item, product: null, error: 'Product unavailable' };
        }
      })
    );

    return { ...cart, items: itemsWithDetails };
  }

  async addToCart(userId: number, dto: AddCartDto) {
    // 1. Verify the product exists in the Product Service
    const product = await this.productClient.getProduct(dto.product_id);
    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Only ${product.stock} items left in stock.`);
    }

    // 2. Get or create the user's cart
    let cart = await this.prisma.cart.findUnique({ where: { user_id: userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { user_id: userId } });
    }

    // 3. Check if item is already in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException(`Cannot add more. Stock limit reached.`);
      }
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }

    // 4. Add new item
    return this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });
  }

  async updateItemQuantity(userId: number, itemId: number, dto: UpdateCartDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.user_id !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.productClient.getProduct(item.product_id);
    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Only ${product.stock} items left in stock.`);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.user_id !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }
}