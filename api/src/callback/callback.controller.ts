import { Body, Controller, Post } from '@nestjs/common';
import { SkipAuth } from 'src/auth/auth.guard';
import { CallbackDto } from './callback.dto';
import { CallbackService } from './callback.service';

@Controller('request-callback')
export class CallbackController {
  constructor(private callbackService: CallbackService) {}

  @Post('')
  @SkipAuth()
  requestCallback(@Body() callBackDto: CallbackDto): Promise<{
    message: string;
  }> {
    return this.callbackService.requestCallback(callBackDto);
  }
}
