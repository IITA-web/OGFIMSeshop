import { Controller, Get, Param } from '@nestjs/common';
import { SubCategory } from 'src/schemas/sub-category.schema';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private categoryService: SubCategoryService) {}

  @Get('/:category')
  async getCategories(
    @Param('category') category: string,
  ): Promise<SubCategory[]> {
    return await this.categoryService.findAll(category);
  }

  @Get('/category')
  async getCategoriesAll(): Promise<SubCategory[]> {
    return await this.categoryService.findAllCategories();
  }

  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // async createCategory(@Body() category: SubCategory): Promise<SubCategory> {
  //   return await this.categoryService.create(category);
  // }
}
