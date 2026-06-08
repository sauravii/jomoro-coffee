import {
  Injectable,
  NotFoundException,
  BadRequestException,
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

    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const product = await this.productClient.getProduct(item.product_id);
          return {
            product_id: item.product_id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
          };
        } catch {
          return {
            product_id: item.product_id,
            name: null,
            price: null,
            quantity: item.quantity,
            error: 'Product unavailable',
          };
        }
      }),
    );

    return itemsWithDetails;
  }

  async addToCart(userId: number, dto: AddCartDto) {
    const product = await this.productClient.getProduct(dto.product_id);
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Only ${product.stock} items left in stock.`,
      );
    }

    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { user_id: userId } });
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });

    if (existingItem) {
      throw new BadRequestException(`Product already exists in cart.`);
    }

    return this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });
  }

  async updateItemByProductId(
    userId: number,
    productId: number,
    dto: UpdateCartDto,
  ) {
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { user_id: userId } });
    }

    const item = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!item) {
      throw new NotFoundException(
        `Product with ID ${productId} not found in cart.`,
      );
    }

    const product = await this.productClient.getProduct(productId);
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Only ${product.stock} items left in stock.`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });
  }

  async removeItemByProductId(userId: number, productId: number) {
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
      throw new NotFoundException(
        `Product with ID ${productId} not found in cart.`,
      );
    }

    return this.prisma.cartItem.delete({ where: { id: item.id } });
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.prisma.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });
  }
}
