import { Activity } from './../schemas/activity.schema';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductService } from 'src/product/product.service';
import Util from 'src/utils/util';
import { ChartDto } from './dto/chart.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name, 'NEW')
    private activityModel: mongoose.Model<Activity>,
    private productService: ProductService,
  ) {}

  async createActivity(id: string): Promise<Activity> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const activityForToday = await this.activityModel.findOne({
      listing: id,
      date: currentDate,
    });

    if (activityForToday) {
      activityForToday.views += 1;

      return await activityForToday.save();
    }

    const activity = await this.activityModel.create({
      date: currentDate,
      listing: id,
    });

    return activity;
  }

  async getProductActivity(id: string): Promise<{
    views: number;
    days: number;
  }> {
    const product = await this.productService.getProductForPromotion(id);

    if (product && product.active_promotion) {
      const currentDate = new Date(product.active_promotion.start_date);

      currentDate.setHours(0, 0, 0, 0);

      const activities = await this.activityModel.find(
        {
          listing: product.id,
          date: {
            $gte: currentDate,
          },
        },
        {
          views: 1,
        },
      );
      const views: number = activities.reduce((acc, val) => acc + val.views, 0);

      return {
        views,
        days: Util.calculateRemainingDays(product.active_promotion.end_date),
      };
    }

    return {
      views: 0,
      days: 0,
    };
  }

  async getChart(body: ChartDto): Promise<
    {
      date: Date;
      views: 0;
    }[]
  > {
    const { range, product } = body;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const startDate = new Date(currentDate);

    startDate.setDate(currentDate.getDate() - range);

    const chartData = await this.activityModel
      .find(
        {
          listing: product,
          date: { $gte: startDate, $lte: currentDate },
        },
        {
          date: 1,
          views: 1,
        },
      )
      .exec();

    const dataArray = Array.from({ length: range }, (_, i) => {
      const date = new Date(currentDate);

      date.setDate(currentDate.getDate() - (range - 1) + i);
      return { date, views: 0 };
    });
    const chartMap = new Map();

    chartData.forEach((data) => {
      const date = data.date.toISOString();

      chartMap.set(date, data.views);
    });

    const result = dataArray.map((data) => ({
      date: data.date,
      views: chartMap.get(data.date.toISOString()) || 0,
    }));

    return result;
  }
}
