import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: '— get cart list' })
  async getCart(@Request() req) {
    const data = await this.cartService.getCart(req.user.id);
    return {
      status: 200,
      message: 'Cart list fetched successfully',
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: '— add item to cart' })
  async addToCart(@Request() req, @Body() dto: AddCartDto) {
    const data = await this.cartService.addToCart(req.user.id, dto);
    return {
      status: 201,
      message: 'Item added to cart successfully',
      data,
    };
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: '— update quantity item' })
  async updateItem(
    @Request() req, 
    @Param('product_id', ParseIntPipe) productId: number, 
    @Body() dto: UpdateCartDto
  ) {
    const data = await this.cartService.updateItemByProductId(req.user.id, productId, dto);
    return {
      status: 200,
      message: 'Cart item quantity updated successfully',
      data,
    };
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: '— delete one item' })
  async removeItem(@Request() req, @Param('product_id', ParseIntPipe) productId: number) {
    const data = await this.cartService.removeItemByProductId(req.user.id, productId);
    return {
      status: 200,
      message: 'Item deleted from cart successfully',
      data,
    };
  }

  @Post('clear')
  @ApiOperation({ summary: '— clear all items' })
  async clearCart(@Request() req) {
    await this.cartService.clearCart(req.user.id);
    return {
      status: 200,
      message: 'Cart cleared successfully',
      data: null,
    };
  }
}