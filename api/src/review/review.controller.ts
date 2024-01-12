import { Review } from './../schemas/review.schema';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';
import { SkipAuth } from 'src/auth/auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('')
  @SkipAuth()
  createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<{ message: string }> {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get('/:id')
  @SkipAuth()
  getReview(@Param('id') vendorId: string): Promise<Review[]> {
    return this.reviewService.getVendorReviews(vendorId);
  }

  @Get('/top/:id')
  @SkipAuth()
  geTopReview(@Param('id') vendorId: string): Promise<Review[]> {
    return this.reviewService.getTopVendorReviews(vendorId);
  }
}
