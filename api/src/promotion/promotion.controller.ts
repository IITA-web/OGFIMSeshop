import { PromotionService } from './promotion.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PromotionDto } from './dto/promotion.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('/product')
  @UseGuards(AuthGuard('jwt'))
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
  async handlePaystackEvent(@Body() payload, @Req() req) {
    const signature = req.headers['x-paystack-signature'];

    return await this.promotionService.webhook(payload, signature);
  }
}
