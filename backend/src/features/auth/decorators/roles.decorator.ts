import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';

export const AUTH_ROLES = 'auth:roles';
export const Roles = (...roles: Role[]) => SetMetadata(AUTH_ROLES, roles);
