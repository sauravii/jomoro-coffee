import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@Request() req, @Body() dto: AddCartDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  updateItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateItem(req.user.id, productId, dto);
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: 'Remove item from cart' })
  deleteItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return this.cartService.deleteItem(req.user.id, productId);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all items from cart' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}