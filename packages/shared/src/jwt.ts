import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const signToken = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
  secret: string,
  options?: SignOptions,
): string => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
