import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Public (Guest, Customer, Admin)')
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get() 
  @ApiOperation({ summary: '— list all categories' })
  getAllCategories() { return this.categoryService.getAllCategories(); }
}