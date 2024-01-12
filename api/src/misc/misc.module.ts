import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MiscService } from './misc.service';
import { MiscController } from './misc.controller';
import { SystemSchema } from 'src/schemas/settings.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature(
      [
        {
          name: 'System',
          schema: SystemSchema,
        },
      ],
      'NEW',
    ),
  ],
  providers: [MiscService],
  controllers: [MiscController],
})
export class MiscModule {}
