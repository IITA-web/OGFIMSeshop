import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Callback } from 'src/schemas/callback.schema';
import { Vendor } from 'src/schemas/vendor.schema';
import { NotificationsService } from 'src/utils/notification.service';
import { CallbackDto } from './callback.dto';

@Injectable()
export class CallbackService {
  constructor(
    @InjectModel(Callback.name, 'NEW')
    private callbackModel: mongoose.Model<Callback>,
    @InjectModel(Vendor.name, 'NEW')
    private vendorModel: mongoose.Model<Vendor>,
    private notificationsService: NotificationsService,
  ) {}

  async requestCallback(payload: CallbackDto): Promise<{
    message: string;
  }> {
    const vendor = await this.vendorModel.findById(payload.vendor);

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    //TODO: send sms vendor
    this.notificationsService.sendCallbackEmail(vendor.email, {
      ...payload,
      vendor: vendor.first_name,
    });

    const callback = await this.callbackModel.create(payload);

    if (!callback) {
      throw new NotFoundException('Callback request failed');
    }

    return {
      message: 'Callback request successful',
    };
  }
}
