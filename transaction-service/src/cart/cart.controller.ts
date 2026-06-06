import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  addToCart(@Request() req, @Body() dto: AddCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Patch(':itemId')
  updateItem(@Request() req, @Param('itemId', ParseIntPipe) itemId: number, @Body() dto: UpdateCartDto) {
    return this.cartService.updateItemQuantity(req.user.id, itemId, dto);
  }

  @Delete(':itemId')
  removeItem(@Request() req, @Param('itemId', ParseIntPipe) itemId: number) {
    return this.cartService.removeItem(req.user.id, itemId);
  }
}