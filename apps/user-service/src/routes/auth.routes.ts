import { Router } from 'express';
import * as authController from '@controllers/auth.controller';

const router = Router();

// POST /api/auth/forgot-password  — send OTP to email
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/verify-otp  — verify OTP and receive new password via email
router.post('/verify-otp', authController.verifyOtp);

export default router;
