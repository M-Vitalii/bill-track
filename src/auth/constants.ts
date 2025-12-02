import { TokenConfig } from './interfaces';

export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'default_secret',
};

export const IS_PUBLIC_KEY = 'isPublic';

export const ACCESS_TOKEN_CONFIG: TokenConfig = {
  secretKey: 'JWT_ACCESS_TOKEN_SECRET',
  expirationMsKey: 'JWT_ACCESS_TOKEN_EXPIRATION_MS',
  cookieName: 'Authentication',
};

export const REFRESH_TOKEN_CONFIG: TokenConfig = {
  secretKey: 'JWT_REFRESH_TOKEN_SECRET',
  expirationMsKey: 'JWT_REFRESH_TOKEN_EXPIRATION_MS',
  cookieName: 'Refresh',
};
