import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipAuth } from 'src/auth/auth.guard';
import { MiscService } from './misc.service';

@Controller('misc')
export class MiscController {
  constructor(
    private miscService: MiscService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @SkipAuth()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.miscService.uploadFile(file);
  }

  @Delete('upload/:id')
  @SkipAuth()
  deleteFile(@Param('id') file: string) {
    return this.miscService.deleteFile(file);
  }

  @Get('privacy-policy')
  @SkipAuth()
  getPrivacyPolicy() {
    return this.miscService.getPrivacyPolicy();
  }

  @Get('terms-and-conditions')
  @SkipAuth()
  getTermsAndConditions() {
    return this.miscService.getTermsAndConditions();
  }

  @Get('social-media')
  @SkipAuth()
  getSocialMedia() {
    return this.miscService.getSocialMedia();
  }

  @Get('plans')
  @SkipAuth()
  plans() {
    return this.configService.get<Record<string, any>[]>('PLANS');
  }
}
