import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../common/enums/role.enum';
import type { AuthenticatedRequest } from '../auth-session.types';
import { AUTH_ROLES } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(AUTH_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const { auth } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!auth || !roles.includes(auth.user.role)) {
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        code: 'ROLE_FORBIDDEN',
        message: 'No tienes permiso para entrar a este panel.',
      });
    }
    return true;
  }
}
