import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import logger from '@utils/logger';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      logger.warn(`Validation failed on ${req.method} ${req.path}: ${JSON.stringify(errors)}`);
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }
    req.body = result.data;
    next();
  };
