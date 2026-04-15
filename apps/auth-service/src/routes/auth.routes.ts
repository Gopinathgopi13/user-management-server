import { Router } from 'express';
import { login, refreshToken, logout, me } from '@controllers/auth.controller';
import { authenticate } from '@middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
