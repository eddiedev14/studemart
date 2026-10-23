import { jwtLifetimeSeconds } from './jwt.config';

describe('JWT lifetime configuration', () => {
  it.each([
    ['1s', 1],
    ['15m', 900],
    ['2h', 7200],
    ['1d', 86400],
    ['30d', 2592000],
  ])('accepts %s', (input, seconds) => {
    expect(jwtLifetimeSeconds(input)).toBe(seconds);
  });
  it.each([
    '0s',
    '31d',
    '-1h',
    '1y',
    'never',
    '1.5h',
    '999999999999999999999d',
    '',
  ])('rejects %s', (input) => {
    expect(() => jwtLifetimeSeconds(input)).toThrow('JWT_EXPIRES_IN');
  });
});
