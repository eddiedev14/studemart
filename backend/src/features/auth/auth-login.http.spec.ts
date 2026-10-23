/** @jest-environment ./src/features/auth/auth-test.environment.cjs */
import type { INestApplication } from '@nestjs/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import request from 'supertest';
import type { Server } from 'node:http';
import { Role } from '../../common/enums/role.enum';
import { DashboardController } from '../dashboard/dashboard.controller';
import { DashboardService } from '../dashboard/dashboard.service';
import { AuthAccountsService } from './auth-accounts.service';
import { AuthLoginController } from './auth-login.controller';
import { AuthLoginService } from './auth-login.service';
import type { AccountType, LoginAccount } from './auth-session.types';
import { AuthSession } from './entities/auth-session.entity';
import { JwtSessionGuard } from './guards/jwt-session.guard';
import { RolesGuard } from './guards/roles.guard';
import { createJwtOptions } from './jwt.config';

// These installed Nest integrations are ESM-only. Load the real modules through
// Node's native require(ESM), which the repository's Jest version cannot do yet.
declare const authNestIntegrations: {
  common: typeof import('@nestjs/common');
  core: typeof import('@nestjs/core');
  testing: typeof import('@nestjs/testing');
  validator: typeof import('class-validator');
  transformer: typeof import('class-transformer');
  config: typeof import('@nestjs/config');
  jwt: typeof import('@nestjs/jwt');
  typeorm: typeof import('@nestjs/typeorm');
};
jest.mock('@nestjs/common', () => authNestIntegrations.common);
jest.mock('@nestjs/core', () => authNestIntegrations.core);
jest.mock('@nestjs/testing', () => authNestIntegrations.testing);
jest.mock('class-validator', () => authNestIntegrations.validator);
jest.mock('class-transformer', () => authNestIntegrations.transformer);
jest.mock('@nestjs/config', () => authNestIntegrations.config);
jest.mock('@nestjs/jwt', () => authNestIntegrations.jwt);
jest.mock('@nestjs/typeorm', () => authNestIntegrations.typeorm);

describe('Login, session lifecycle and role panels (HTTP)', () => {
  let app: INestApplication;
  let server: Server;
  let jwt: JwtService;
  let passwordHash: string;
  const sessions = new Map<string, AuthSession>();
  const accounts = new Map<string, LoginAccount>();
  const accountKey = (type: AccountType, id: string) => `${type}:${id}`;
  const password = 'UnaClaveSegura123';
  const repository = {
    create: (value: Partial<AuthSession>) =>
      Object.assign(new AuthSession(), value),
    save: jest.fn((value: AuthSession) => {
      sessions.set(value.id, value);
      return Promise.resolve(value);
    }),
    findOneBy: jest.fn(({ id }: { id: string }) =>
      Promise.resolve(sessions.get(id) ?? null),
    ),
    update: jest.fn(({ id }: { id: string }, patch: Partial<AuthSession>) => {
      const value = sessions.get(id);
      if (value) Object.assign(value, patch);
      return Promise.resolve({ affected: value ? 1 : 0 });
    }),
  };
  const accountService = {
    findByEmail: jest.fn((email: string, type: AccountType) =>
      Promise.resolve(
        [...accounts.entries()].find(
          ([key, value]) => key.startsWith(`${type}:`) && value.email === email,
        )?.[1] ?? null,
      ),
    ),
    findById: jest.fn((id: string, type: AccountType) =>
      Promise.resolve(accounts.get(accountKey(type, id)) ?? null),
    ),
  };

  beforeAll(async () => {
    passwordHash = await hash(password, 4);
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register(
          createJwtOptions(
            new ConfigService({
              jwt: {
                secret: 'test-only-secret-with-enough-length',
                expiresIn: '1d',
              },
            }),
          ),
        ),
      ],
      controllers: [AuthLoginController, DashboardController],
      providers: [
        AuthLoginService,
        DashboardService,
        JwtSessionGuard,
        RolesGuard,
        { provide: AuthAccountsService, useValue: accountService },
        { provide: getRepositoryToken(AuthSession), useValue: repository },
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;
    jwt = module.get(JwtService);
  });

  beforeEach(() => {
    sessions.clear();
    accounts.clear();
    jest.clearAllMocks();
    for (const role of Object.values(Role)) {
      const type = role === Role.Admin ? 'admin' : 'user';
      accounts.set(accountKey(type, role), {
        id: role,
        name: `Persona ${role}`,
        email: `${role}@uao.edu.co`,
        passwordHash,
        status: 'ACTIVE',
        role,
      });
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  async function login(role: Role) {
    const path =
      role === Role.Admin ? '/api/auth/admin/login' : '/api/auth/login';
    const result = await request(server)
      .post(path)
      .send({ email: `${role}@uao.edu.co`, password })
      .expect(200);
    return result.body as {
      token: string;
      user: { id: string; name: string; role: Role };
    };
  }

  it.each(Object.values(Role))(
    'logs in %s and permits only its own panel',
    async (role) => {
      const result = await login(role);
      expect(result.user.role).toBe(role);
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('passwordHash');
      for (const panel of Object.values(Role)) {
        const response = await request(server)
          .get(`/api/dashboard/${panel}`)
          .auth(result.token, { type: 'bearer' })
          .expect(panel === role ? 200 : 403);
        if (panel === role) {
          expect(response.body).toMatchObject({
            message: `Bienvenido/a, Persona ${role}.`,
            user: result.user,
          });
        } else {
          expect(response.body).toMatchObject({ code: 'ROLE_FORBIDDEN' });
        }
      }
    },
  );

  it('normalizes email but preserves the password as supplied', async () => {
    await request(server)
      .post('/api/auth/login')
      .send({ email: '  BUYER@UAO.EDU.CO  ', password })
      .expect(200);
    await request(server)
      .post('/api/auth/login')
      .send({ email: 'buyer@uao.edu.co', password: ` ${password}` })
      .expect(401);
  });

  it.each([
    {},
    { email: '', password: '' },
    { email: 'invalid', password },
    { email: 'buyer@uao.edu.co', password: '   ' },
    { email: 'buyer@uao.edu.co', password: 123 },
    { email: 'buyer@uao.edu.co', password, role: 'admin' },
    { email: ['buyer@uao.edu.co'], password },
  ])(
    'rejects invalid fields before looking up credentials (%j)',
    async (body) => {
      await request(server).post('/api/auth/login').send(body).expect(400);
      expect(accountService.findByEmail).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    },
  );

  it.each([
    { email: 'buyer@uao.edu.co', password: 'wrong' },
    { email: 'unknown@uao.edu.co', password },
    { email: 'admin@uao.edu.co', password },
    { email: 'buyer@uao.edu.co', password: '🔐'.repeat(19) },
  ])('returns a generic 401 without creating a session (%j)', async (body) => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(body)
      .expect(401);
    expect(response.body).toMatchObject({
      code: 'INVALID_CREDENTIALS',
      message: 'Correo o contraseña incorrectos.',
    });
    expect(response.body).not.toHaveProperty('token');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('does not allow a user into the admin login', async () => {
    await request(server)
      .post('/api/auth/admin/login')
      .send({ email: 'buyer@uao.edu.co', password })
      .expect(401);
  });

  it.each(['inactive', 'no-password'])(
    'rejects an account that is %s',
    async (state) => {
      const user = accounts.get('user:buyer')!;
      if (state === 'inactive') user.status = 'INACTIVE';
      else user.passwordHash = null;
      await request(server)
        .post('/api/auth/login')
        .send({ email: user.email, password })
        .expect(401);
      expect(sessions.size).toBe(0);
    },
  );

  it.each(Object.values(Role))(
    'requires a token for panel %s',
    async (role) => {
      await request(server).get(`/api/dashboard/${role}`).expect(401);
    },
  );

  it('restores session data across independent requests and service instances', async () => {
    const { token, user } = await login(Role.Buyer);
    const service = new AuthLoginService(
      accountService as unknown as AuthAccountsService,
      jwt,
      repository as unknown as ConstructorParameters<
        typeof AuthLoginService
      >[2],
    );
    expect((await service.authenticate(token)).user).toEqual(user);
    for (let i = 0; i < 2; i++) {
      const response = await request(server)
        .get('/api/auth/me')
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(response.body).toEqual({ user });
    }
  });

  it('revokes logout token, blocks replay, and keeps a separate session active', async () => {
    const first = await login(Role.Buyer);
    const second = await login(Role.Buyer);
    await request(server)
      .post('/api/auth/logout')
      .auth(first.token, { type: 'bearer' })
      .expect(200);
    const response = await request(server)
      .get('/api/dashboard/buyer')
      .auth(first.token, { type: 'bearer' })
      .expect(401);
    expect(response.body).toMatchObject({ code: 'SESSION_REVOKED' });
    await request(server)
      .get('/api/auth/me')
      .auth(second.token, { type: 'bearer' })
      .expect(200);
  });

  it('returns TOKEN_EXPIRED for a correctly signed expired JWT', async () => {
    const token = await jwt.signAsync(
      { sub: 'buyer', jti: 'expired', accountType: 'user', role: Role.Buyer },
      { expiresIn: -1 },
    );
    const response = await request(server)
      .get('/api/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(401);
    expect(response.body).toMatchObject({ code: 'TOKEN_EXPIRED' });
  });

  it('rejects modified signatures, wrong audience and incomplete claims', async () => {
    const { token } = await login(Role.Buyer);
    const [header, payload] = token.split('.');
    const badTokens = [
      `${header}.${payload}.invalid`,
      await jwt.signAsync({ sub: 'buyer' }),
      await jwt.signAsync(
        { sub: 'buyer', jti: 'id', accountType: 'user', role: Role.Buyer },
        { audience: 'other-app' },
      ),
    ];
    for (const bad of badTokens) {
      const response = await request(server)
        .get('/api/auth/me')
        .auth(bad, { type: 'bearer' })
        .expect(401);
      expect(response.body).toMatchObject({ code: 'INVALID_TOKEN' });
    }
  });

  it('rechecks disabled accounts and current role instead of trusting the JWT role', async () => {
    const { token } = await login(Role.Entrepreneur);
    const account = accounts.get('user:entrepreneur')!;
    account.role = Role.Buyer;
    await request(server)
      .get('/api/dashboard/entrepreneur')
      .auth(token, { type: 'bearer' })
      .expect(403);
    const me = await request(server)
      .get('/api/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(me.body).toMatchObject({ user: { role: 'buyer' } });
    account.status = 'INACTIVE';
    await request(server)
      .get('/api/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(401);
  });

  it('rejects a token when its persisted session has expired or disappeared', async () => {
    const { token } = await login(Role.Buyer);
    const session = [...sessions.values()][0];
    session.expiresAt = new Date(0);
    await request(server)
      .get('/api/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(401);
    sessions.clear();
    await request(server)
      .get('/api/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(401);
  });

  it('returns a clear 500 without leaking internal database errors or a token', async () => {
    const logger = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
    accountService.findByEmail.mockRejectedValueOnce(
      new Error('sensitive database details'),
    );
    const response = await request(server)
      .post('/api/auth/login')
      .send({ email: 'buyer@uao.edu.co', password })
      .expect(500);
    expect(response.body).toMatchObject({ code: 'SERVER_ERROR' });
    expect(JSON.stringify(response.body)).not.toContain('sensitive');
    expect(response.body).not.toHaveProperty('token');
    expect(sessions.size).toBe(0);
    logger.mockRestore();
  });
});
