import { ReviewService } from './../review/review.service';
import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Vendor, VendorSchema } from 'src/schemas/vendor.schema';
import { Review, ReviewSchema } from 'src/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Product.name,
          schema: ProductSchema,
        },
        {
          name: Vendor.name,
          schema: VendorSchema,
        },
        {
          name: Review.name,
          schema: ReviewSchema,
        },
      ],
      'NEW',
    ),
  ],
  providers: [VendorService, ReviewService],
  controllers: [VendorController],
})
export class VendorModule {}
