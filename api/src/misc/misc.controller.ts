import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MiscService } from './misc.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('misc')
export class MiscController {
  constructor(
    private miscService: MiscService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.miscService.uploadFile(file);
  }

  @Delete('upload/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteFile(@Param('id') file: string) {
    return this.miscService.deleteFile(file);
  }

  @Get('privacy-policy')
  getPrivacyPolicy() {
    return this.miscService.getPrivacyPolicy();
  }

  @Get('terms-and-conditions')
  getTermsAndConditions() {
    return this.miscService.getTermsAndConditions();
  }

  @Get('social-media')
  getSocialMedia() {
    return this.miscService.getSocialMedia();
  }

  @Get('plans')
  plans() {
    return this.configService.get<Record<string, any>[]>('PLANS');
  }
}
