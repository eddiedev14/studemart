import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export function jwtLifetimeSeconds(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  const seconds = match ? Number(match[1]) * units[match[2]] : NaN;
  if (!Number.isSafeInteger(seconds) || seconds < 1 || seconds > 30 * 86400) {
    throw new Error('JWT_EXPIRES_IN debe ser entre 1s y 30d (s, m, h o d).');
  }
  return seconds;
}

export function createJwtOptions(config: ConfigService): JwtModuleOptions {
  return {
    secret: config.getOrThrow<string>('jwt.secret'),
    signOptions: {
      algorithm: 'HS256',
      issuer: 'studemart-api',
      audience: 'studemart-web',
      expiresIn: jwtLifetimeSeconds(config.getOrThrow<string>('jwt.expiresIn')),
    },
    verifyOptions: {
      algorithms: ['HS256'],
      issuer: 'studemart-api',
      audience: 'studemart-web',
    },
  };
}
