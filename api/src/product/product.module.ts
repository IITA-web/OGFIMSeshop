import { SubCategoryService } from './../sub-category/sub-category.service';
import { CategoryService } from './../category/category.service';
import { Vendor, VendorSchema } from './../schemas/vendor.schema';
import { Product, ProductSchema } from './../schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';
import { CategorySchema } from 'src/schemas/category.schema';
import { SubCategorySchema } from 'src/schemas/sub-category.schema';
import { ReviewService } from 'src/review/review.service';
import { Review, ReviewSchema } from 'src/schemas/review.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeatureAsync(
      [
        {
          name: Product.name,
          useFactory: () => {
            const schema = ProductSchema;

            schema.plugin(require('mongoose-slug-updater'));
            return schema;
          },
        },
        {
          name: Review.name,
          useFactory: () => {
            const schema = ReviewSchema;

            return schema;
          },
        },
        {
          name: 'SubCategory',
          useFactory: () => {
            const schema = SubCategorySchema;

            schema.plugin(require('mongoose-slug-updater'));
            return schema;
          },
        },
        {
          name: 'Category',
          useFactory: () => {
            const schema = CategorySchema;

            schema.plugin(require('mongoose-slug-updater'));
            return schema;
          },
        },
        {
          name: Vendor.name,
          useFactory: () => {
            const schema = VendorSchema;
            return schema;
          },
        },
      ],
      'NEW',
    ),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryService,
    SubCategoryService,
    ReviewService,
  ],
})
export class ProductModule {}
