import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

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
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.adminRole !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};
