import { Request, Response } from 'express';
import * as userService from '@services/user.service';
import logger from '@shared/logger';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const search = req.query.search as string | undefined;
    const role_id = req.query.role_id as string | undefined;
    const { data, ...result } = await userService.findAllUsers(page, size, { search, role_id });
    res.json({
      status: true,
      data: {
        list: data,
        ...result,
      },
      message: 'Users fetched successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch users';
    logger.error(`getUsers error: ${message}`);
    res.status(500).json({ message });
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await userService.getUserStats();
    res.json({
      status: true,
      data: stats,
      message: 'User stats fetched successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user stats';
    logger.error(`getStats error: ${message}`);
    res.status(500).json({ message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findUserById(req.params.id as string);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user';
    logger.error(`getUserById error: ${message}`);
    res.status(500).json({ message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, role_id } = req.body;
  try {
    const user = await userService.createUser({ name, email, role_id });
    const io = req.app.get('io');
    if (io) io.to('admins').emit('user:created', user);
    res.status(201).json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user';
    logger.error(`createUser error: ${message}`);
    res.status(409).json({ message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.updateUser(req.params.id as string, req.body);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const io = req.app.get('io');
    if (io) io.to('admins').emit('user:updated', user);
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user';
    logger.error(`updateUser error: ${message}`);
    res.status(400).json({ message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const result = await userService.deleteUser(id);
    if (!result) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const io = req.app.get('io');
    if (io) io.to('admins').emit('user:deleted', { id });
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete user';
    logger.error(`deleteUser error: ${message}`);
    res.status(500).json({ message });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'currentPassword and newPassword are required' });
    return;
  }
  try {
    const userId = (req as any).userId;
    await userService.changeUserPassword(userId, currentPassword, newPassword);
    res.json({
      status: true,
      message: 'Password changed successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to change password';
    logger.error(`changePassword error: ${message}`);
    res.status(400).json({ message });
  }
};

export const validateCredentials = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  try {
    const user = await userService.validateCredentials(email, password);
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid credentials';
    res.status(401).json({ message });
  }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      otp_code: user.otp_code,
      otp_expires_at: user.otp_expires_at,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user';
    logger.error(`getUserByEmail error: ${message}`);
    res.status(500).json({ message });
  }
};

export const updateUserOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, otp_expires_at } = req.body;
  if (!email || !otp || !otp_expires_at) {
    res.status(400).json({ message: 'email, otp and otp_expires_at are required' });
    return;
  }
  try {
    const updated = await userService.setUserOtpByEmail(email, otp, new Date(otp_expires_at));
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ status: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user OTP';
    logger.error(`updateUserOtp error: ${message}`);
    res.status(500).json({ message });
  }
};

export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, password_hash } = req.body;
  if (!email || !password_hash) {
    res.status(400).json({ message: 'email and password_hash are required' });
    return;
  }
  try {
    const updated = await userService.resetPasswordByEmail(email, password_hash);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ status: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset password';
    logger.error(`resetUserPassword error: ${message}`);
    res.status(500).json({ message });
  }
};
