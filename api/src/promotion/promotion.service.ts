import { PromotionDocument } from './../schemas/promotion.schema';
import { Injectable, BadRequestException, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { Promotion } from 'src/schemas/promotion.schema';
import { Vendor } from 'src/schemas/vendor.schema';
import Util from 'src/utils/util';
import { PromotionDto } from './dto/promotion.dto';
import { PaymentService } from './payment/payment.service';
import paystack from 'paystack';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from 'src/utils/notification.service';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name, 'NEW')
    private promotionModel: mongoose.Model<Promotion>,
    @InjectModel(Product.name, 'NEW')
    private productModel: mongoose.Model<Product>,
    private paymentService: PaymentService,
    private notificationService: NotificationsService,
  ) {}

  async createSponsorship(payload: PromotionDto, vendor: Vendor) {
    try {
      const promotion = await this.promotionModel.create({
        ...payload,
        vendor: vendor._id,
        status: 'pending',
      });

      const {
        status,
        data: { status: paymentStatus, paid_at },
      } = await this.paymentService.verifyPayment(payload.paystack_reference);

      if (!status) {
        return {
          message: 'Payment is being processed',
        };
      }

      if (paymentStatus === 'success') {
        return await this.processPayment(
          promotion,
          paymentStatus,
          paid_at,
          payload.product,
          false,
        );
      } else {
        promotion.status = paymentStatus;

        await promotion.save();

        return {
          message: `Payment status: ${paymentStatus}`,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  @Cron('0 0 6 * * *', {
    timeZone: 'Africa/Lagos',
  })
  async expiredPromotion(): Promise<void> {
    try {
      const currentDate = new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Lagos',
      });
      const isoCurrentDate = new Date(currentDate).toISOString();
      const expiredPromotions = await this.promotionModel
        .find({
          end_date: {
            $lt: isoCurrentDate,
          },
          status: 'success',
        })
        .populate('vendor');

      await Promise.all(
        expiredPromotions.map(async (promotion) => {
          const { vendor } = promotion;
          const product = await this.productModel.findById(promotion.product);

          if (product) {
            product.active_promotion = null;
            await product.save();
          }

          promotion.status = 'expired';
          await promotion.save();

          if (vendor && product) {
            const payload = {
              url: 'ogfimsweb@gmail.com',
              vendor_name: vendor.first_name,
              product_name: product.name,
              product_slug: product.slug,
              product_image: product.images[0]?.url,
            };

            await this.notificationService.sendExpiredEmail(
              vendor.email,
              payload,
            );
          }
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Cron('0 0 6 * * *', {
    timeZone: 'Africa/Lagos',
  })
  async willExpiry(): Promise<void> {
    try {
      const currentDate = new Date();
      const tomorrowDate = new Date();

      tomorrowDate.setDate(currentDate.getDate() + 1);

      const formattedTomorrowDate = new Date(
        tomorrowDate.getFullYear(),
        tomorrowDate.getMonth(),
        tomorrowDate.getDate(),
        0,
        0,
        0,
        0,
      ).toISOString();

      const expiringTomorrowPromotions = await this.promotionModel
        .find(
          {
            end_date: {
              $gte: currentDate.toISOString(),
              $lt: formattedTomorrowDate,
            },
            status: 'success',
          },
          {
            vendor: 1,
          },
        )
        .populate('vendor product');

      await Promise.all(
        expiringTomorrowPromotions.map(async (promotion) => {
          const { vendor, product } = promotion;

          if (vendor && product) {
            const payload = {
              vendor_name: vendor.first_name,
              product_name: product.name,
              product_slug: product.slug,
              product_image: product.images[0].url,
            };

            await this.notificationService.sendExpirationEmail(
              vendor.email,
              payload,
            );
          }
        }),
      );
    } catch (e) {
      console.error(e);
    }
  }

  async webhook(body: paystack.Response, signature: any): Promise<any> {
    if (!this.paymentService.verifyHookSender(body, signature)) {
      throw new BadRequestException();
    }

    const { event, data } = body;

    switch (event) {
      case 'charge.success': {
        const {
          reference,
          status,
          paid_at,
          metadata: { product },
        } = data;

        const promotion = await this.promotionModel.findOne({
          paystack_reference: reference,
          status: { $ne: status },
        });

        if (promotion) {
          return await this.processPayment(
            promotion,
            status,
            paid_at,
            product,
            true,
          );
        }
      }

      default:
        break;
    }

    return HttpCode(200);
  }

  async processPayment(
    promotion: PromotionDocument,
    status: string,
    paid_at: Date,
    productId: Types.ObjectId | string,
    isWebHook: boolean,
  ): Promise<{ message: string } | void> {
    const [existingPromotion, product] = await Promise.all([
      this.promotionModel.findById(promotion.id).populate('vendor'),
      this.productModel.findById(productId),
    ]);

    if (existingPromotion && product) {
      existingPromotion.start_date = new Date(paid_at);
      existingPromotion.end_date = Util.addDays(paid_at, promotion.duration);
      existingPromotion.status = status;
      product.active_promotion = promotion.id;

      await Promise.all([product.save(), existingPromotion.save()]);

      if (status === 'success') {
        const { vendor } = existingPromotion;

        if (vendor && product) {
          const payload = {
            vendor_name: vendor.first_name,
            product_name: product.name,
            product_slug: product.slug,
            product_image: product.images[0].url,
          };

          await this.notificationService.sendPromotionEmail(
            vendor.email,
            payload,
          );
        }
      }

      if (!isWebHook) {
        return { message: 'Payment completed successfully' };
      }
    } else {
      console.error('promotion error');
    }
  }
}
