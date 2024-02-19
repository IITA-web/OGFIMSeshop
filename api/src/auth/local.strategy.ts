import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Vendor } from 'src/schemas/vendor.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'emailOrPhone' });
  }

  async validate(emailOrPhone: string, password: string): Promise<Vendor> {
    let user = await this.authService.login({ emailOrPhone, password });

    if (!user || user === null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
