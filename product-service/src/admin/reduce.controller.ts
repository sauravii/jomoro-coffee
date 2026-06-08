import { Controller, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin only (Bearer Token + role ADMIN)')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(AuthGuard('jwt'))
export class ReduceController {
  constructor(private adminService: AdminService) {}

  @Post(':id/reduce')
  @ApiOperation({ summary: '— reduce stock' })
  reduce(@Param('id', ParseIntPipe) id: number, @Body() dto: ReduceStockDto) {
    return this.adminService.reduceStock(id, dto);
  }
}