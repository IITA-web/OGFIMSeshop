import { Body, Controller, Post } from '@nestjs/common';
import { CreateReportDto } from './dto/report.dto';
import { ReportService } from './report.service';

@Controller('report-vendor')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post('')
  reportVendor(
    @Body() reportDto: CreateReportDto,
  ): Promise<{ message: string }> {
    return this.reportService.reportVendor(reportDto);
  }
}
