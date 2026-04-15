import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate } from '../middlewares/auth.middleware';
import config from '../config';

const router = Router();

// Public auth routes (login, logout)
router.use(
  '/auth',
  createProxyMiddleware({
    target: config.authServiceUrl,
    changeOrigin: true,
    pathRewrite: (path) => `/api/auth${path}`,
  }),
);

// Protected profile routes
router.use(
  '/profile',
  authenticate,
  createProxyMiddleware({
    target: config.authServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/profile': '/api/auth/profile' },
  }),
);

export default router;
