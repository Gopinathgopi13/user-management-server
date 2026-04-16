import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate } from '../middlewares/auth.middleware';
import config from '../config';

const router = Router();

// Forgot-password & OTP routes → user-service (must be before the generic /auth proxy)
router.use(
  '/auth/forgot-password',
  createProxyMiddleware({
    target: config.userServiceUrl,
    changeOrigin: true,
    pathRewrite: () => '/api/auth/forgot-password',
  }),
);

router.use(
  '/auth/verify-otp',
  createProxyMiddleware({
    target: config.userServiceUrl,
    changeOrigin: true,
    pathRewrite: () => '/api/auth/verify-otp',
  }),
);

// Public auth routes (login, logout) → auth-service
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
