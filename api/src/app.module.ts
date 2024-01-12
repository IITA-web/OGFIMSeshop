import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ReportModule } from './report/report.module';
import { CallbackModule } from './callback/callback.module';
import { MiscModule } from './misc/misc.module';
import { VendorModule } from './vendor/vendor.module';
import { PromotionModule } from './promotion/promotion.module';
import { TwilioModule } from 'nestjs-twilio';
import { ActivityModule } from './activity/activity.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionName: 'NEW',
    }),
    MongooseModule.forRoot(process.env.OLD_PLATFORM_MONGODB_URI, {
      connectionName: 'OLD',
    }),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    CategoryModule,
    SubCategoryModule,
    AuthModule,
    ProductModule,
    ReviewModule,
    ReportModule,
    CallbackModule,
    MiscModule,
    VendorModule,
    PromotionModule,
    ActivityModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
