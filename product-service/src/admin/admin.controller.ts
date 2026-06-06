import { Controller, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Product Management') 
@ApiBearerAuth()                     
@Controller('admin/products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  // Correctly inject the AdminService here
  constructor(private adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coffee or pastry item' })
  create(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Update an existing product' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductDto) {
    return this.adminService.updateProduct(id, dto);
  }

  @Post(':id/reduce')
  @ApiOperation({ summary: 'Reduce product stock after a purchase' })
  reduce(@Param('id', ParseIntPipe) id: number, @Body() dto: ReduceStockDto) {
    return this.adminService.reduceStock(id, dto);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a product from the catalog' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteProduct(id);
  }
}