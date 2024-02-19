import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/schemas/category.schema';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Get('/sub-categories')
  async getCategoriesWithSubcategories(): Promise<Category[]> {
    return await this.categoryService.findAllWithSubCategories();
  }

  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // async createCategory(@Body() category: Category): Promise<Category> {
  //   return await this.categoryService.create(category);
  // }
}
