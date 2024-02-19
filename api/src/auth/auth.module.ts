import {
  VerificationCode,
  VerificationCodeSchema,
} from './../schemas/verification-code.schema';
import { NotificationsService } from './../utils/notification.service';
import { Vendor, VendorSchema } from './../schemas/vendor.schema';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from 'src/schemas/old_platform.schema';
import { TwilioModule } from 'nestjs-twilio';
import { LocalStrategy } from './local.strategy';
import { RefreshStrategy } from './refresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES') || '600d',
          },
        };
      },
    }),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    MongooseModule.forFeature(
      [
        { name: Vendor.name, schema: VendorSchema },
        { name: VerificationCode.name, schema: VerificationCodeSchema },
      ],
      'NEW',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'OLD'),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshStrategy,
    NotificationsService,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
