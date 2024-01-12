import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategorySchema } from 'src/schemas/sub-category.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: 'SubCategory',
          useFactory: () => {
            const schema = SubCategorySchema;

            schema.plugin(require('mongoose-slug-updater'));
            return schema;
          },
        },
      ],
      'NEW',
    ),
  ],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
})
export class SubCategoryModule {}
