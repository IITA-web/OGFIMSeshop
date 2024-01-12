import { UpdateVendorDto } from './dto/update.dto';
import { Vendor } from './../schemas/vendor.schema';
import { LoginDto } from './dto/login.dto';
import { AccountActivationDto, SignUpDto } from './dto/signup.dto';
import { Body, Controller, Get, Query, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/schemas/old_platform.schema';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { SkipAuth } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/pre-signup')
  @SkipAuth()
  preSignUp(
    @Query('emailOrPhone') emailOrPhone,
  ): Promise<User | { message: string; registered: boolean } | null> {
    return this.authService.preSignUp(emailOrPhone);
  }

  @Post('/signup')
  @SkipAuth()
  signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; registered: boolean }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/post-signup')
  @SkipAuth()
  postSignUp(
    @Body() accountActivationDto: AccountActivationDto,
  ): Promise<{ token: string }> {
    return this.authService.accountVerification(accountActivationDto);
  }

  @Get('/resend-verification')
  @SkipAuth()
  resendVerification(@Query('emailOrPhone') emailOrPhone): Promise<{
    message: string;
  }> {
    return this.authService.resendCode(emailOrPhone);
  }

  @Post('/forgot-password')
  @SkipAuth()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{
    message: string;
  }> {
    return this.authService.requestPasswordReset(forgotPasswordDto);
  }

  @Put('/reset-password')
  @SkipAuth()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{
    message: string;
  }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put('/change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<{
    message: string;
  }> {
    return this.authService.changePassword(req.user, changePasswordDto);
  }

  @Post('/login')
  @SkipAuth()
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Put('/vendor/update')
  updateVendor(@Body() vendor: UpdateVendorDto, @Req() req): Promise<Vendor> {
    return this.authService.updateProfile(vendor, req.user);
  }
}
