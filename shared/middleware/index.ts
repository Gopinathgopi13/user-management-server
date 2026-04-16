import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

interface JwtPayload {
  sub: string;
  role: string;
}

type JwtVerifier = (token: string, secret: string) => unknown;

export const createAuthenticateMiddleware =
  (getJwtSecret: () => string | undefined, verifyToken: JwtVerifier) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`Missing token on ${req.method} ${req.path}`);
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = getJwtSecret();
    if (!jwtSecret) {
      logger.error('JWT secret is not configured');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    try {
      const decoded = verifyToken(token, jwtSecret) as JwtPayload;
      req.userId = decoded.sub;
      req.userRole = decoded.role;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    const message = err instanceof Error ? err.message : 'Internal server error';
    logger.error(`Unhandled error: ${message}`);
    res.status(500).json({ message });
  };
  
  export const notFound = (_req: Request, res: Response): void => {
    res.status(404).json({ message: 'Route not found' });
  };
  