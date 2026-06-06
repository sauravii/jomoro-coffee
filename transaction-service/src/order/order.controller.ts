import { Controller, Post, Get, UseGuards, Request, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  checkout(
    @Request() req, 
    @Headers('authorization') authHeader: string
  ) {
    // Forward the authorization header so the Product Service accepts the stock reduction
    return this.orderService.checkout(req.user.id, authHeader);
  }

  @Get()
  getOrders(@Request() req) {
    return this.orderService.getOrderHistory(req.user.id);
  }
}