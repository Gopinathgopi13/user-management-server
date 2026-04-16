import { Router } from 'express';
import { login, refreshToken, logout, me, forgotPassword, verifyOtp } from '@controllers/auth.controller';
import { authenticate } from '@middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
