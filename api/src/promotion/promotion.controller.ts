import { PromotionService } from './promotion.service';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { PromotionDto } from './dto/promotion.dto';
import { SkipAuth } from 'src/auth/auth.guard';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('/product')
  async createSponsorship(
    @Body() sponsorshipData: PromotionDto,
    @Req() request,
  ) {
    return this.promotionService.createSponsorship(
      sponsorshipData,
      request.user,
    );
  }

  @Post('/webhook')
  @SkipAuth()
  async handlePaystackEvent(@Body() payload, @Req() req) {
    const signature = req.headers['x-paystack-signature'];

    return await this.promotionService.webhook(payload, signature);
  }
}
