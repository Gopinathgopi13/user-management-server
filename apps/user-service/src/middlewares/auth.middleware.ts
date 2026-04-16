import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@config';
import Role from '@models/role.model';
import logger from '@utils/logger';

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
    const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload;
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
        logger.warn(`Permission check failed: no role on request for ${resource}:${action}`);
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      try {
        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) {
          logger.warn(`Permission check failed: role "${roleName}" not found for ${resource}:${action}`);
          res.status(403).json({ message: 'Forbidden' });
          return;
        }
        const allowed = role.permissions[resource] ?? [];
        if (!allowed.includes(action)) {
          logger.warn(`Permission denied for role "${roleName}": ${resource}:${action}`);
          res.status(403).json({ status: false, message: `Permission denied: ${resource}:${action}` });
          return;
        }
        next();
      } catch (err) {
        logger.error(`Permission check error for ${resource}:${action} — ${err}`);
        res.status(500).json({ message: 'Permission check failed' });
      }
    };

export const internalKeyGuard = (req: Request, res: Response, next: NextFunction): void => {
  const key = config.internal_API_Key || 'internal_secret_key';
  if (req.headers['x-internal-key'] !== key) {
    logger.warn(`Internal key guard rejected request: ${req.method} ${req.path}`);
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  next();
};
