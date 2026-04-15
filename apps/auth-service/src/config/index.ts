import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '8001';

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
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'auth_db',
  },
};
