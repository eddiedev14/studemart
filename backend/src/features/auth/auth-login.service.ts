import { randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { AuthAccountsService } from './auth-accounts.service';
import type {
  AccountType,
  LoginAccount,
  SessionClaims,
  SessionUser,
} from './auth-session.types';
import { LoginDto } from './dto/login.dto';
import { AuthSession } from './entities/auth-session.entity';

export function sessionError(code: string, message: string) {
  return new UnauthorizedException({
    statusCode: 401,
    error: 'Unauthorized',
    code,
    message,
  });
}

@Injectable()
export class AuthLoginService {
  // Equal password work for absent accounts and accounts without a local password.
  private readonly dummyHash = hash(randomUUID(), 12);

  constructor(
    private readonly accounts: AuthAccountsService,
    private readonly jwt: JwtService,
    @InjectRepository(AuthSession)
    private readonly sessions: Repository<AuthSession>,
  ) {}

  async login(dto: LoginDto, accountType: AccountType = 'user') {
    const account = await this.accounts.findByEmail(dto.email, accountType);
    const validPassword =
      Buffer.byteLength(dto.password, 'utf8') <= 72 &&
      (await compare(
        dto.password,
        account?.passwordHash ?? (await this.dummyHash),
      ));
    if (
      !validPassword ||
      !account?.passwordHash ||
      account.status !== 'ACTIVE'
    ) {
      throw sessionError(
        'INVALID_CREDENTIALS',
        'Correo o contraseña incorrectos.',
      );
    }

    const user = this.toUser(account);
    const id = randomUUID();
    const token = await this.jwt.signAsync({
      sub: user.id,
      jti: id,
      accountType,
      role: user.role,
    });
    // decode only our freshly signed token to persist exactly the same expiration.
    const { exp } = this.jwt.decode<SessionClaims>(token);
    await this.sessions.save(
      this.sessions.create({
        id,
        accountId: user.id,
        accountType,
        expiresAt: new Date(exp * 1000),
        revokedAt: null,
      }),
    );
    return { token, user };
  }

  async authenticate(token: string) {
    let claims: SessionClaims;
    try {
      claims = await this.jwt.verifyAsync<SessionClaims>(token);
      if (
        typeof claims.sub !== 'string' ||
        typeof claims.jti !== 'string' ||
        !['user', 'admin'].includes(claims.accountType) ||
        !Object.values(Role).includes(claims.role) ||
        !Number.isInteger(claims.exp)
      ) {
        throw new Error('Invalid claims');
      }
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        throw sessionError(
          'TOKEN_EXPIRED',
          'Tu sesión venció. Inicia sesión de nuevo.',
        );
      }
      throw sessionError(
        'INVALID_TOKEN',
        'La sesión no es válida. Inicia sesión de nuevo.',
      );
    }

    const session = await this.sessions.findOneBy({ id: claims.jti });
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now() ||
      session.accountId !== claims.sub ||
      session.accountType !== claims.accountType
    ) {
      throw sessionError(
        'SESSION_REVOKED',
        'La sesión terminó. Inicia sesión de nuevo.',
      );
    }

    const account = await this.accounts.findById(
      claims.sub,
      claims.accountType,
    );
    if (!account || account.status !== 'ACTIVE') {
      throw sessionError(
        'SESSION_INVALID',
        'La cuenta no tiene una sesión activa.',
      );
    }
    // Recompute the role from the database, so a revoked store loses seller access immediately.
    return { user: this.toUser(account), sessionId: session.id };
  }

  async logout(sessionId: string) {
    await this.sessions.update({ id: sessionId }, { revokedAt: new Date() });
    return { message: 'Sesión cerrada correctamente.' };
  }

  private toUser(account: LoginAccount): SessionUser {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    };
  }
}
