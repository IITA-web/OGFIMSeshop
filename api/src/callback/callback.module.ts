import { Module } from '@nestjs/common';
import { CallbackService } from './callback.service';
import { CallbackController } from './callback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Callback, CallbackSchema } from 'src/schemas/callback.schema';
import { Vendor, VendorSchema } from 'src/schemas/vendor.schema';
import { NotificationsService } from 'src/utils/notification.service';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    MongooseModule.forFeature(
      [
        {
          name: Callback.name,
          schema: CallbackSchema,
        },
        {
          name: Vendor.name,
          schema: VendorSchema,
        },
      ],
      'NEW',
    ),
  ],
  providers: [CallbackService, NotificationsService],
  controllers: [CallbackController],
})
export class CallbackModule {}
