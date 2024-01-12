import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const vendor = await this.authService.findUserById(payload.sub);

    if (!vendor) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    if (!vendor.active) {
      throw new UnauthorizedException('Profile not active');
    }

    return vendor;
  }
}
