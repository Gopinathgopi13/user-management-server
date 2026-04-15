import { Request, Response } from 'express';
import * as authService from '@services/auth.service';
import logger from '@utils/logger';

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
