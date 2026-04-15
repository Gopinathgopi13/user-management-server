import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const message = err instanceof Error ? err.message : 'Internal server error';
  logger.error(`Unhandled error: ${message}`);
  res.status(500).json({ message });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Route not found' });
};
