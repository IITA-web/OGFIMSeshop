import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ChartDto } from './dto/chart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post('/:id')
  @UseGuards(AuthGuard('jwt'))
  async createActivity(@Param('id') id: string) {
    return await this.activityService.createActivity(id);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getActivity(@Param('id') id: string): Promise<{
    views: number;
    days: number;
  }> {
    return await this.activityService.getProductActivity(id);
  }

  @Post('/history/chart')
  @UseGuards(AuthGuard('jwt'))
  async getChart(@Body() payload: ChartDto): Promise<
    {
      date: Date;
      views: 0;
    }[]
  > {
    return await this.activityService.getChart(payload);
  }
}
