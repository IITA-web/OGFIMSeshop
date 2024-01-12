import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioModule } from 'nestjs-twilio';
import { AuthModule } from 'src/auth/auth.module';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Promotion, PromotionSchema } from 'src/schemas/promotion.schema';
import { Vendor, VendorSchema } from 'src/schemas/vendor.schema';
import { NotificationsService } from 'src/utils/notification.service';
import { PaymentService } from './payment/payment.service';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    AuthModule,
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
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
          name: Promotion.name,
          schema: PromotionSchema,
        },
      ],
      'NEW',
    ),
  ],
  controllers: [PromotionController],
  providers: [PromotionService, PaymentService, NotificationsService],
})
export class PromotionModule {}
