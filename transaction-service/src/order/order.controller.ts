import { Controller, Post, Get, UseGuards, Request, Headers, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiTags('Checkout')
  @ApiOperation({ summary: '— checkout order' })
  async checkout(
    @Request() req, 
    @Headers('authorization') authHeader: string
  ) {
    const data = await this.orderService.checkout(req.user.id, authHeader);
    return {
      status: 201,
      message: 'Checkout completed successfully',
      data,
    };
  }

  @Get()
  @ApiTags('Orders')
  @ApiOperation({ summary: '— get order history' })
  async getOrders(@Request() req) {
    const data = await this.orderService.getOrderHistory(req.user.id);
    return {
      status: 200,
      message: 'Order history fetched successfully',
      data,
    };
  }

  @Post(':id')
  @ApiTags('Orders')
  @ApiOperation({ summary: '— get order detail {id}' })
  async getOrderDetail(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const data = await this.orderService.getOrderDetail(req.user.id, id);
    return {
      status: 200,
      message: 'Order detail fetched successfully',
      data,
    };
  }
}