import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminRole?: 'admin' | 'user';
    }
  }
}

interface JwtPayload {
  sub: string;
  role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Missing token on ${req.method} ${req.path}`);
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.adminId = decoded.sub;
    req.adminRole = decoded.role as 'admin' | 'user';
    next();
  } catch {
    logger.warn(`Invalid or expired token on ${req.method} ${req.path}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.adminRole !== 'admin') {
    logger.warn(`Admin access denied for user: ${req.adminId} on ${req.method} ${req.path}`);
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};
