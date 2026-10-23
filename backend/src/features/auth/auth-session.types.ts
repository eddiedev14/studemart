import type { Request } from 'express';
import { Role } from '../../common/enums/role.enum';

export type AccountType = 'user' | 'admin';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginAccount extends SessionUser {
  status: 'ACTIVE' | 'INACTIVE';
  passwordHash: string | null;
}

export interface SessionClaims {
  sub: string;
  jti: string;
  accountType: AccountType;
  role: Role;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  auth: { user: SessionUser; sessionId: string };
}
