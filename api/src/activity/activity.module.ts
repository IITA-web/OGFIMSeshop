import { PromotionSchema } from './../schemas/promotion.schema';
import { Promotion } from 'src/schemas/promotion.schema';
import { VendorSchema } from './../schemas/vendor.schema';
import { Product, ProductSchema } from './../schemas/product.schema';
import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from 'src/schemas/activity.schema';
import { ProductService } from 'src/product/product.service';
import { Vendor } from 'src/schemas/vendor.schema';
import { PaymentService } from 'src/promotion/payment/payment.service';
import { CategoryService } from 'src/category/category.service';
import { SubCategoryService } from 'src/sub-category/sub-category.service';
import { CategorySchema } from 'src/schemas/category.schema';
import { SubCategorySchema } from 'src/schemas/sub-category.schema';
import { Review, ReviewSchema } from 'src/schemas/review.schema';
import { ReviewService } from 'src/review/review.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Activity.name, schema: ActivitySchema },
        { name: Product.name, schema: ProductSchema },
        { name: Vendor.name, schema: VendorSchema },
        { name: Promotion.name, schema: PromotionSchema },
        { name: Review.name, schema: ReviewSchema },
        { name: 'Category', schema: CategorySchema },
        { name: 'SubCategory', schema: SubCategorySchema },
      ],
      'NEW',
    ),
  ],
  providers: [
    ActivityService,
    ProductService,
    PaymentService,
    CategoryService,
    SubCategoryService,
    ReviewService,
  ],
  controllers: [ActivityController],
})
export class ActivityModule {}
