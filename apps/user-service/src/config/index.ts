import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '8002';

export default {
  port: Number(process.env.PORT),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'user_db',
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
