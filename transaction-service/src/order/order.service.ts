import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductClientService } from '../common/product-client.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private productClient: ProductClientService,
  ) {}

  async checkout(userId: number, authHeader: string) {
    // 1. Retrieve the user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout an empty cart.');
    }

    let totalAmount = 0;
    // FIXED: Explicitly defined the array type so TypeScript doesn't treat it as 'never[]'
    const orderItemsData: { product_id: number; quantity: number; price: number }[] = [];

    // 2. Validate stock and calculate the total amount securely
    for (const item of cart.items) {
      const product = await this.productClient.getProduct(item.product_id);
      
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
      }

      totalAmount += product.price * item.quantity;
      
      // Snapshot the price so the order history remains accurate
      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price, 
      });
    }

    // 3. Process the Order and clear the cart in an atomic transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          user_id: userId,
          total_amount: totalAmount,
          status: 'PAID',
        },
      });

      for (const item of orderItemsData) {
        await tx.orderItem.create({
          data: {
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cart_id: cart.id },
      });

      return newOrder;
    });

    // 4. Reduce the stock in the Product Service
    for (const item of orderItemsData) {
      await this.productClient.reduceProductStock(item.product_id, item.quantity, authHeader);
    }

    return order;
  }

  async getOrderHistory(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { user_id: userId },
      include: { items: true },
      orderBy: { created_at: 'desc' },
    });

    // Attach live product details to the order history response
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            try {
              const product = await this.productClient.getProduct(item.product_id);
              return { ...item, product };
            } catch (error) {
              return { ...item, product: null, error: 'Product unavailable' };
            }
          })
        );
        return { ...order, items: itemsWithProducts };
      })
    );

    return ordersWithProducts;
  }

  async getOrderDetail(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.user_id !== userId) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    const itemsWithProducts = await Promise.all(
      order.items.map(async (item) => {
        try {
          const product = await this.productClient.getProduct(item.product_id);
          return { ...item, product };
        } catch (error) {
          return { ...item, product: null, error: 'Product unavailable' };
        }
      })
    );

    return { ...order, items: itemsWithProducts };
  }
}