import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Report } from 'src/schemas/report.schema';
import { CreateReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name, 'NEW')
    private reportModel: mongoose.Model<Report>,
  ) {}

  async checkDuplicate(googleAuthId: string, vendor: string): Promise<boolean> {
    const existingReport = await this.reportModel.findOne({
      google_auth_id: googleAuthId,
      vendor,
    });

    return !!existingReport;
  }

  async reportVendor(createReportDto: CreateReportDto): Promise<{
    message: string;
  }> {
    const isDuplicate = await this.checkDuplicate(
      createReportDto.google_auth_id,
      createReportDto.vendor,
    );

    if (isDuplicate) {
      throw new BadRequestException({
        message: 'You have already reported this vendor',
      });
    }

    const report = await this.reportModel.create(createReportDto);

    if (!report) {
      throw new BadRequestException({ message: 'Report failed' });
    }

    return {
      message: 'Report successful',
    };
  }
}
