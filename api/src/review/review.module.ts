import { ReviewSchema } from './../schemas/review.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review } from 'src/schemas/review.schema';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Review.name,
          schema: ReviewSchema,
        },
      ],
      'NEW',
    ),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
