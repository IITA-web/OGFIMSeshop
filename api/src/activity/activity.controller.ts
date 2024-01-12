import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SkipAuth } from 'src/auth/auth.guard';
import { ActivityService } from './activity.service';
import { ChartDto } from './dto/chart.dto';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post('/:id')
  @SkipAuth()
  async createActivity(@Param('id') id: string) {
    return await this.activityService.createActivity(id);
  }

  @Get('/:id')
  @SkipAuth()
  async getActivity(@Param('id') id: string): Promise<{
    views: number;
    days: number;
  }> {
    return await this.activityService.getProductActivity(id);
  }

  @Post('/history/chart')
  @SkipAuth()
  async getChart(@Body() payload: ChartDto): Promise<
    {
      date: Date;
      views: 0;
    }[]
  > {
    return await this.activityService.getChart(payload);
  }
}
