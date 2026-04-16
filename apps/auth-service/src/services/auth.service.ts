import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '@models';
import config from '@config';
import logger from '@utils/logger';
import type { RefreshTokenRepoType, UserInfo } from '../types/auth.types';

const RefreshTokenRepo = RefreshToken as RefreshTokenRepoType;

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateAccessToken = (user: UserInfo): string =>
  jwt.sign(
    { sub: user.id, role: user.role.name },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
  );

const generateRefreshToken = (): string =>
  crypto.randomBytes(64).toString('hex');

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${config.userService.url}/api/internal/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': config.userService.internalKey,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      logger.warn(`Login failed for email: ${email} — ${body.message || 'Invalid credentials'}`);
      throw new Error(body.message || 'Invalid credentials');
    }

    const user = (await response.json()) as UserInfo;

    const rawToken = generateRefreshToken();
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.refreshToken.expiresInDays);

    await RefreshTokenRepo.create({
      user_id: user.id,
      token: hashedToken,
      expires_at: expiresAt,
    });

    logger.info(`User logged in: ${user.id}`);
    return {
      accessToken: generateAccessToken(user),
      refreshToken: rawToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  } catch (error) {
    logger.error(`login error for email ${email}: ${error}`);
    throw error;
  }
};

export const refresh = async (rawToken: string) => {
  try {
    const hashedToken = hashToken(rawToken);
    const record = await RefreshTokenRepo.findOne({ where: { token: hashedToken } });

    if (!record) {
      logger.warn('Refresh token not found');
      throw new Error('Invalid refresh token');
    }
    if (record.is_revoked) {
      logger.warn(`Revoked refresh token used for user: ${record.user_id}`);
      throw new Error('Refresh token has been revoked');
    }
    if (record.expires_at < new Date()) {
      logger.warn(`Expired refresh token used for user: ${record.user_id}`);
      throw new Error('Refresh token has expired');
    }

    // Revoke old token and issue a new one (rotation)
    await record.update({ is_revoked: true });

    const response = await fetch(`${config.userService.url}/api/internal/users/${record.user_id}`, {
      headers: { 'X-Internal-Key': config.userService.internalKey },
    });

    if (!response.ok) {
      logger.error(`User not found during token refresh: ${record.user_id}`);
      throw new Error('User not found');
    }
    const user = (await response.json()) as UserInfo;

    if (user.status !== 'active') {
      logger.warn(`Token refresh rejected for inactive account: ${user.id}`);
      throw new Error('Account is not active');
    }

    const newRawToken = generateRefreshToken();
    const newHashedToken = hashToken(newRawToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.refreshToken.expiresInDays);

    await RefreshTokenRepo.create({
      user_id: user.id,
      token: newHashedToken,
      expires_at: expiresAt,
    });

    logger.info(`Token refreshed for user: ${user.id}`);
    return {
      accessToken: generateAccessToken(user),
      refreshToken: newRawToken,
    };
  } catch (error) {
    logger.error(`refresh error: ${error}`);
    throw error;
  }
};

export const logout = async (rawToken: string) => {
  try {
    const hashedToken = hashToken(rawToken);
    const record = await RefreshTokenRepo.findOne({ where: { token: hashedToken } });
    if (!record) {
      logger.warn('Logout attempted with invalid refresh token');
      throw new Error('Invalid refresh token');
    }
    await record.update({ is_revoked: true });
    logger.info(`User logged out: ${record.user_id}`);
  } catch (error) {
    logger.error(`logout error: ${error}`);
    throw error;
  }
};
