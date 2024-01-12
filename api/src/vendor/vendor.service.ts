import { ReviewService } from './../review/review.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { Vendor } from 'src/schemas/vendor.schema';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Product.name, 'NEW')
    private productModel: mongoose.Model<Product>,
    @InjectModel(Vendor.name, 'NEW')
    private vendorModel: mongoose.Model<Vendor>,
    private reviewService: ReviewService,
  ) {}

  async getVendorDetialsAndProducts(vendorId: string) {
    const vendor = await this.vendorModel.findOne(
      {
        _id: vendorId,
        active: true,
      },
      {
        first_name: 1,
        _id: 1,
        last_name: 1,
        image: 1,
        createdAt: 1,
        phone_number: 1,
        email: 1,
        tags: 1,
      },
    );

    if (!vendor) {
      throw new NotFoundException('No vendor found');
    }

    const products = await this.productModel.find({
      vendor: vendor.id,
      is_deleted: false,
      is_published: true,
    });

    return {
      vendor,
      products,
      rate: await this.reviewService.getVendorReviewAverage(vendor.id),
    };
  }
}
