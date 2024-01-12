import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const SKIP_AUTH_KEY = 'skipAuth';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(ctx: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    return skipAuth ?? super.canActivate(ctx);
  }

  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    return super.handleRequest(...args);
  }
}

/**
 * Used in conjunction with the JWT Auth Guard.
 */
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
