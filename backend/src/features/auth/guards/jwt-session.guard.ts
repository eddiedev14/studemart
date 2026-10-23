import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthLoginService, sessionError } from '../auth-login.service';
import type { AuthenticatedRequest } from '../auth-session.types';

@Injectable()
export class JwtSessionGuard implements CanActivate {
  constructor(private readonly auth: AuthLoginService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const match = /^Bearer ([^\s]+)$/i.exec(
      request.headers.authorization ?? '',
    );
    if (!match) {
      throw sessionError('SESSION_REQUIRED', 'Inicia sesión para continuar.');
    }
    request.auth = await this.auth.authenticate(match[1]);
    return true;
  }
}
