import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductClientService } from '../common/product-client.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private productClient: ProductClientService,
  ) {}

  async checkout(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: { user_id: userId },
      });

      for (const item of cart.items) {
        const product = await this.productClient.getProductById(item.product_id);

        await tx.orderDetail.create({
          data: {
            order_id: newOrder.id,
            product_id: item.product_id,
            price: product?.price ?? 0,
            quantity: item.quantity,
          },
        });

        await this.productClient.reduceStock(item.product_id, item.quantity);
      }

      await tx.cartItem.deleteMany({
        where: { cart_id: cart.id },
      });

      return newOrder;
    });

    return { message: 'Checkout successful', order_id: order.id };
  }

  async getOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return orders;
  }

  async getOrderDetail(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, user_id: userId },
      include: { details: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const detailsWithProduct = await Promise.all(
      order.details.map(async (detail) => {
        const product = await this.productClient.getProductById(detail.product_id);
        return {
          product_id: detail.product_id,
          name: product?.name ?? 'Unknown',
          quantity: detail.quantity,
          price: detail.price,
        };
      }),
    );

    return {
      order_id: order.id,
      created_at: order.created_at,
      items: detailsWithProduct,
    };
  }
}