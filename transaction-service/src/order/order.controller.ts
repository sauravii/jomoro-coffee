import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Checkout - create order from cart' })
  checkout(@Request() req) {
    return this.orderService.checkout(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for current user' })
  getOrders(@Request() req) {
    return this.orderService.getOrders(req.user.id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'Get order detail by ID' })
  getOrderDetail(
    @Request() req,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.orderService.getOrderDetail(req.user.id, orderId);
  }
}