import dotenv from 'dotenv';
import path from 'path';

const envFound = dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});
if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.USER_SERVICE_PORT || '7002';

export default {
  port: Number(process.env.PORT),
  db: {
    host: process.env.USER_DB_HOST || 'localhost',
    port: Number(process.env.USER_DB_PORT) || 5432,
    username: process.env.USER_DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || '',
    database: process.env.USER_DB_NAME || 'user_db',
  },
  jwt_secret: process.env.JWT_SECRET || '',
  internal_API_Key: process.env.INTERNAL_API_KEY || 'internal_secret_key',
  mail: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    address: process.env.MAIL_ADDRESS || 'noreply@example.com',
    username: process.env.MAIL_USERNAME || 'noreply@example.com',
    password: process.env.MAIL_PASSWORD || 'password',
  },
};
