import dotenv from 'dotenv';
import path from 'path';

const envFound = dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});
if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.AUTH_SERVICE_PORT || '7001';

export default {
  port: Number(process.env.PORT),
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  refreshToken: {
    expiresInDays: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,
  },
  userService: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:8002',
    internalKey: process.env.INTERNAL_API_KEY || 'internal_secret_key',
  },
  mail: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    address: process.env.MAIL_ADDRESS || 'noreply@example.com',
    username: process.env.MAIL_USERNAME || 'noreply@example.com',
    password: process.env.MAIL_PASSWORD || 'password',
  },
  db: {
    host: process.env.AUTH_DB_HOST || 'localhost',
    port: Number(process.env.AUTH_DB_PORT) || 5432,
    username: process.env.AUTH_DB_USER || 'postgres',
    password: process.env.AUTH_DB_PASSWORD || '',
    database: process.env.AUTH_DB_NAME || 'auth_db',
  },
};
