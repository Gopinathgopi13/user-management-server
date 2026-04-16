import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});

export default {
  port: Number(process.env.GATEWAY_PORT) || 7000,
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:8002',
};
