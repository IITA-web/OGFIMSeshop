import { VerificationCode } from './../schemas/verification-code.schema';
import { Vendor } from './../schemas/vendor.schema';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { AccountActivationDto, SignUpDto } from './dto/signup.dto';
import { UpdateVendorDto } from './dto/update.dto';
import { User } from 'src/schemas/old_platform.schema';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { NotificationsService } from 'src/utils/notification.service';
import Util from 'src/utils/util';
import * as randomToken from 'rand-token';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Vendor.name, 'NEW')
    private vendorModel: mongoose.Model<Vendor>,
    @InjectModel(User.name, 'OLD')
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async getJWTToken(vendor: Vendor): Promise<string> {
    return await this.jwtService.signAsync({ ...vendor.toJSON() });
  }

  public async getRefreshToken(userId: string): Promise<string> {
    const userDataToUpdate = {
      refreshToken: randomToken.generate(16),
      refreshTokenExp: moment().day(1).toDate(),
    };

    await this.vendorModel.updateOne(
      { id: userId },
      { $set: { userDataToUpdate } },
    );
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<Vendor> {
    const currentDate = moment().day(1).toDate();

    let vendor = await this.vendorModel.findOne({
      email: email,
      refreshToken: refreshToken,
      refreshTokenExp: { $gte: currentDate },
    });

    if (!vendor) {
      return null;
    }

    return vendor;
  }

  async findUserById(id: string): Promise<Vendor> {
    return await this.vendorModel.findById(id).exec();
  }

  async preSignUp(
    emailOrPhone: string,
  ): Promise<User | { message: string; registered: boolean } | null> {
    let phoneNumber: number | undefined;

    if (!emailOrPhone) {
      throw new BadRequestException();
    }

    const vendor = await this.vendorModel.findOne({
      $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
    });

    if (vendor) {
      if (!vendor.active) {
        this.notificationsService.sendSMSVerification(vendor.phone_number);

        return {
          message: "Yov're already registered, please activate your account",
          registered: true,
        };
      } else {
        throw new ConflictException(
          'User already registered, please login to continue',
        );
      }
    }

    try {
      phoneNumber = parseInt(emailOrPhone, 10);
    } catch (error) {}

    const query =
      phoneNumber !== undefined
        ? {
            $or: [
              { email: { $regex: new RegExp(emailOrPhone, 'i') } },
              { mobileNumber: phoneNumber },
              { mobileNumber: Util.number2Util(emailOrPhone) },
              { alternateMobileNumber: Util.number2Util(emailOrPhone) },
              { alternateMobileNumber: phoneNumber },
            ],
          }
        : { email: { $regex: new RegExp(emailOrPhone, 'i') } };

    const response = await this.userModel.findOne(query, {
      firstName: 1,
      lastName: 1,
      _uuid: 1,
      profileImage: 1,
      mobileNumber: 1,
      email: 1,
    });

    if (!response) {
      throw new NotFoundException(
        'User not found, please check your provided information',
      );
    }

    return response;
  }

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; registered: boolean }> {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      main_app_vendor_id,
      tags,
      image,
    } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const vendor = await this.vendorModel.create({
        email: email?.toLowerCase().trim(),
        first_name,
        last_name,
        phone_number: Util.number2Util(phone_number),
        main_app_vendor_id,
        tags,
        image,
        password: hashedPassword,
      });

      this.notificationsService.sendSMSVerification(vendor.phone_number);

      return {
        message: 'Registration completed, pending code activation',
        registered: true,
      };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate Email Entered');
      }

      throw new BadRequestException('Unable to process request');
    }
  }

  async accountVerification(
    accountActivationDto: AccountActivationDto,
  ): Promise<{ token: string; user: Vendor }> {
    const { code, emailOrPhone } = accountActivationDto;
    const vendor = await this.vendorModel.findOne(
      {
        $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
      },
      {
        first_name: 1,
        _id: 1,
        id: 1,
        last_name: 1,
        phone_number: 1,
        email: 1,
        image: 1,
        active: 1,
        tags: 1,
        createdAt: 1,
      },
    );

    if (!vendor) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    const isVerified = await this.notificationsService.verifySMS(
      code,
      emailOrPhone,
    );

    if (!isVerified || isVerified.status !== 'approved') {
      throw new BadRequestException('Unable to verify code');
    }

    vendor.active = true;
    await vendor.save();

    this.notificationsService.sendWelcomeEmail(vendor.email, {
      name: vendor.first_name,
    });

    const token = this.jwtService.sign({ sub: vendor._id });

    return { token, user: vendor };
  }

  async resendCode(emailOrPhone: string): Promise<{ message: string }> {
    const vendor = await this.vendorModel.findOne({
      $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
    });

    if (!vendor) {
      throw new NotFoundException('Phone number not found');
    }

    this.notificationsService.sendSMSVerification(vendor.phone_number);

    return { message: 'Code resent' };
  }

  async login(loginDto: LoginDto): Promise<Vendor> {
    const { emailOrPhone, password } = loginDto;
    const vendor = await this.vendorModel.findOne(
      {
        $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
      },
      {
        first_name: 1,
        _id: 1,
        id: 1,
        last_name: 1,
        phone_number: 1,
        email: 1,
        image: 1,
        active: 1,
        tags: 1,
        createdAt: 1,
        password: 1,
      },
    );

    if (!vendor) {
      throw new NotFoundException('Invalid email or password');
    }

    if (!vendor.active) {
      throw new UnauthorizedException('Profile not active');
    }

    const isPasswordMatched = await bcrypt.compare(password, vendor.password);

    if (!isPasswordMatched) {
      throw new NotFoundException('Invalid email or password');
    }

    try {
      const user = vendor;

      delete user.password;
      return user;
    } catch (e) {
      throw new BadRequestException('Unable to authenticate your credentials');
    }
  }

  async requestPasswordReset(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { emailOrPhone } = forgotPasswordDto;
      const vendor = await this.vendorModel.findOne({
        $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
      });

      if (vendor) {
        this.notificationsService.sendSMSVerification(vendor.phone_number);
      }

      return {
        message: 'Password reset notification to your email and phone number',
      };
    } catch (error) {
      throw new BadRequestException('Unable to process request');
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    try {
      const { resetToken, newPassword, emailOrPhone } = resetPasswordDto;
      const vendor = await this.vendorModel.findOne({
        $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
      });

      if (!vendor) {
        throw new NotFoundException('Invalid or expired reset token');
      }

      const isVerified = await this.notificationsService.verifySMS(
        resetToken,
        vendor.phone_number,
      );

      if (!isVerified || isVerified.status !== 'approved') {
        throw new BadRequestException('Unable to verify code');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.vendorModel.updateOne(
        { _id: vendor._id },
        {
          password: hashedPassword,
        },
      );

      this.notificationsService.sendSecurityEmail(vendor.email, {
        name: vendor.first_name,
      });

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw new BadRequestException('Unable to process request');
    }
  }

  async changePassword(
    vendor: Vendor,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      vendor.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.vendorModel.updateOne(
      { _id: vendor._id },
      { password: hashedNewPassword },
    );

    this.notificationsService.sendSecurityEmail(vendor.email, {
      name: vendor.first_name,
    });

    return {
      message: 'Password changed successfully',
    };
  }

  async updateProfile(profile: UpdateVendorDto, user: Vendor): Promise<Vendor> {
    const vendor = await this.vendorModel.findById(user._id);

    if (profile.first_name) {
      vendor.first_name = profile.first_name;
    }

    if (profile.last_name) {
      vendor.last_name = profile.last_name;
    }

    if (profile.image) {
      vendor.image = profile.image;
    }

    if (profile.tags) {
      vendor.tags = profile.tags;
    }

    if (profile.bio) {
      vendor.bio = profile.bio;
    }

    await Promise.all([
      vendor.save(),
      this.userModel.updateOne(
        {
          _uuid: vendor.main_app_vendor_id,
        },
        {
          $set: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            profileImage: profile.image,
          },
        },
      ),
    ]);

    return vendor;
  }
}
