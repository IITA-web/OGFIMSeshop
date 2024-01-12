import { CategorySchema } from './../schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SubCategorySchema } from 'src/schemas/sub-category.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: 'Category',
          useFactory: () => {
            const schema = CategorySchema;

            schema.plugin(require('mongoose-slug-updater'));
            return schema;
          },
        },
        {
          name: 'SubCategory',
          useFactory: () => {
            const schema = SubCategorySchema;
            return schema;
          },
        },
      ],
      'NEW',
    ),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
