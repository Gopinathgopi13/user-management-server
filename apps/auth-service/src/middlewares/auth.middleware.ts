import jwt from 'jsonwebtoken';
import config from '@config';
import { createAuthenticateMiddleware } from '@shared/middleware';

export const authenticate = createAuthenticateMiddleware(
  () => config.jwt.secret,
  (token, secret) => jwt.verify(token, secret),
);
