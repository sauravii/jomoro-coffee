import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Public (Guest, Customer, Admin)')
@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('products')
  @ApiOperation({ summary: '— list all products' })
  getAllProducts() { return this.productService.getAllProducts(); }

  @Get('products/:id')
  @ApiOperation({ summary: '— get product by id' })
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @Get('categories/:categoryId/products')
  @ApiOperation({ summary: '— list product by category' })
  getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.getProductsByCategory(categoryId);
  }
}