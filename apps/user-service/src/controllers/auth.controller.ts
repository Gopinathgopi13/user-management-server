import { Request, Response } from 'express';
import * as userService from '@services/user.service';
import logger from '@utils/logger';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ status: false, message: 'Email is required' });
    return;
  }
  try {
    await userService.sendForgotPasswordOtp(email);
    res.json({ status: true, message: 'OTP sent to your email address' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send OTP';
    logger.error(`forgotPassword error: ${message}`);
    res.status(400).json({ status: false, message });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ status: false, message: 'Email and OTP are required' });
    return;
  }
  try {
    await userService.verifyOtpAndResetPassword(email, otp);
    res.json({ status: true, message: 'OTP verified. New password has been sent to your email' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'OTP verification failed';
    logger.error(`verifyOtp error: ${message}`);
    res.status(400).json({ status: false, message });
  }
};
