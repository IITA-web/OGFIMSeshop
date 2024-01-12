import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipAuth } from 'src/auth/auth.guard';
import { Category } from 'src/schemas/category.schema';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @SkipAuth()
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get('/sub-categories')
  @SkipAuth()
  async getCategoriesWithSubcategories(): Promise<Category[]> {
    return await this.categoryService.findAllWithSubCategories();
  }

  // @Post()
  // @SkipAuth()
  // async createCategory(@Body() category: Category): Promise<Category> {
  //   return await this.categoryService.create(category);
  // }
}
