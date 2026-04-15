import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config';
import Role from '@models/role.model';

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

export const requirePermission =
  (resource: string, action: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roleName = req.userRole;
    if (!roleName) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    try {
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      const allowed = role.permissions[resource] ?? [];
      if (!allowed.includes(action)) {
        res.status(403).json({ status: false, message: `Permission denied: ${resource}:${action}` });
        return;
      }
      next();
    } catch {
      res.status(500).json({ message: 'Permission check failed' });
    }
  };

export const internalKeyGuard = (req: Request, res: Response, next: NextFunction): void => {
  const key = config.internal_API_Key || 'internal_secret_key';
  if (req.headers['x-internal-key'] !== key) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  next();
};
