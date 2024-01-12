import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Review } from 'src/schemas/review.schema';
import { Vendor } from 'src/schemas/vendor.schema';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name, 'NEW')
    private reviewModel: mongoose.Model<Review>,
  ) {}

  async checkDuplicate(googleAuthId: string, vendor: string): Promise<boolean> {
    const existingReport = await this.reviewModel.findOne({
      google_auth_id: googleAuthId,
      vendor,
    });

    return !!existingReport;
  }

  async getVendorReviewAverage(vendorId: string): Promise<number> {
    const aggregationResult = await this.reviewModel.aggregate([
      {
        $match: { vendor: vendorId },
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
        },
      },
    ]);

    if (aggregationResult.length > 0) {
      return aggregationResult[0].average;
    } else {
      return 0;
    }
  }

  async getTopVendorReviews(
    vendorId: string,
    limit: number = 5,
  ): Promise<Review[]> {
    try {
      const reviews = await this.reviewModel
        .find({ vendor: vendorId })
        .sort({ dateCreated: -1 })
        .limit(limit);

      return reviews;
    } catch (error) {
      throw new Error('Error fetching top vendor reviews: ' + error.message);
    }
  }

  async getVendorReviews(vendorId: string): Promise<Review[]> {
    try {
      const reviews = await this.reviewModel
        .find(
          { vendor: vendorId },
          {
            _id: 1,
            name: 1,
            comment: 1,
            rating: 1,
            createdAt: 1,
          },
        )
        .sort({ dateCreated: -1 });

      return reviews;
    } catch (error) {
      throw new Error('Error fetching top vendor reviews: ' + error.message);
    }
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<{
    message: string;
  }> {
    try {
      const alreadyReview = await this.checkDuplicate(
        createReviewDto.google_auth_id,
        createReviewDto.vendor,
      );

      if (alreadyReview) {
        throw new BadRequestException({
          message: "You can't review a vendor multiple times",
        });
      }

      const review = await this.reviewModel.create(createReviewDto);

      if (!review) {
        throw new BadRequestException({ message: 'Report failed' });
      }

      return {
        message: 'Report successful',
      };
    } catch (error) {
      throw new BadRequestException({ message: 'Report failed' });
    }
  }
}
