import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/schemas/report.schema';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Report.name,
          schema: ReportSchema,
        },
      ],
      'NEW',
    ),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
