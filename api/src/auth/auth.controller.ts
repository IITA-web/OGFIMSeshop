import { UpdateVendorDto } from './dto/update.dto';
import { Vendor } from './../schemas/vendor.schema';
import { LoginDto } from './dto/login.dto';
import { AccountActivationDto, SignUpDto } from './dto/signup.dto';
import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Put,
  Req,
  UseGuards,
  Res,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/schemas/old_platform.schema';
import { Response } from 'express';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/pre-signup')
  preSignUp(
    @Query('emailOrPhone') emailOrPhone,
  ): Promise<User | { message: string; registered: boolean } | null> {
    return this.authService.preSignUp(emailOrPhone);
  }

  @Post('/signup')
  signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; registered: boolean }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/post-signup')
  async postSignUp(
    @Body() accountActivationDto: AccountActivationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: Vendor }> {
    const response = await this.authService.accountVerification(
      accountActivationDto,
    );
    const { user, token } = response;
    const refreshToken = await this.authService.getRefreshToken(user._id);
    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });

    return {
      user,
    };
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: Vendor }> {
    const token = await this.authService.getJWTToken(req.user as Vendor);
    const refreshToken = await this.authService.getRefreshToken(req.user._id);
    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });

    return {
      user: req.user,
    };
  }

  @Get('/resend-verification')
  resendVerification(@Query('emailOrPhone') emailOrPhone): Promise<{
    message: string;
  }> {
    return this.authService.resendCode(emailOrPhone);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{
    message: string;
  }> {
    return this.authService.requestPasswordReset(forgotPasswordDto);
  }

  @Put('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{
    message: string;
  }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put('/change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req,
  ): Promise<{
    message: string;
  }> {
    return this.authService.changePassword(req.user, changePasswordDto);
  }

  @Get('refresh-token')
  @UseGuards(AuthGuard('refresh'))
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ token: string }> {
    const token = await this.authService.getJWTToken(req.user as Vendor);
    const refreshToken = await this.authService.getRefreshToken(req.user._id);
    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });

    return { token };
  }

  @Put('/vendor/update')
  @UseGuards(AuthGuard('jwt'))
  updateVendor(@Body() vendor: UpdateVendorDto, @Req() req): Promise<Vendor> {
    return this.authService.updateProfile(vendor, req.user);
  }

  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res({ passthrough: true }) res: Response): Promise<Boolean> {
    res.clearCookie('auth-cookie');

    return true;
  }
}
