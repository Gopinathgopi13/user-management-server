import { Request, Response } from 'express';
import * as authService from '@services/auth.service';
import logger from '@shared/logger';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  try {
    const result = await authService.login(email, password);
    res.json({
      status: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    logger.error(`Login error: ${message}`);
    res.status(401).json({ message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }
  try {
    const result = await authService.refresh(refreshToken);
    res.json({
      status: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Token refresh failed';
    logger.error(`Refresh error: ${message}`);
    res.status(401).json({ message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    res.status(400).json({ message: 'Refresh token is required' });
    return;
  }
  try {
    await authService.logout(refresh_token);
    res.json({ status: true, message: 'Logged out successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Logout failed';
    logger.error(`Logout error: ${message}`);
    res.status(400).json({ message });
  }
};

export const me = (req: Request, res: Response): void => {
  res.json({ id: req.userId, role: req.userRole });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ status: false, message: 'Email is required' });
    return;
  }
  try {
    await authService.forgotPassword(email);
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
    await authService.verifyOtpAndResetPassword(email, otp);
    res.json({ status: true, message: 'OTP verified. New password has been sent to your email' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'OTP verification failed';
    logger.error(`verifyOtp error: ${message}`);
    res.status(400).json({ status: false, message });
  }
};
