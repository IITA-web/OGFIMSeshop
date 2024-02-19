import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CallbackDto } from './callback.dto';
import { CallbackService } from './callback.service';

@Controller('request-callback')
export class CallbackController {
  constructor(private callbackService: CallbackService) {}

  @Post('')
  requestCallback(@Body() callBackDto: CallbackDto): Promise<{
    message: string;
  }> {
    return this.callbackService.requestCallback(callBackDto);
  }
}
