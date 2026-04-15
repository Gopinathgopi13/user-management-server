import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config';

interface JwtPayload {
  sub: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.sub;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

export const internalKeyGuard = (req: Request, res: Response, next: NextFunction): void => {
  const key = config.internal_API_Key || 'internal_secret_key';
  if (req.headers['x-internal-key'] !== key) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  next();
};
