import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import config from '../config';

const router = Router();

const proxy = createProxyMiddleware({
  target: config.userServiceUrl,
  changeOrigin: true,
  pathRewrite: (path) => `/api/roles${path}`,
});

router.get('/', authenticate, proxy);
router.get('/:id', authenticate, proxy);

router.post('/', authenticate, requireAdmin, proxy);
router.put('/:id', authenticate, requireAdmin, proxy);
router.delete('/:id', authenticate, requireAdmin, proxy);

export default router;
