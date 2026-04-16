import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RefreshToken } from '@models';
import config from '@config';
import logger from '@shared/logger';
import transporter, { MAIL_FROM } from '@shared/mailer';
import { otpTemplate } from '../templates/otp.template';
import { newPasswordTemplate } from '../templates/new-password.template';
import type { RefreshTokenRepoType, UserInfo, InternalUserAuthData } from '../types/auth.types';

const RefreshTokenRepo = RefreshToken as RefreshTokenRepoType;
const OTP_EXPIRY_MINUTES = 10;

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

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const userRes = await fetch(`${config.userService.url}/api/internal/users/by-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': config.userService.internalKey,
      },
      body: JSON.stringify({ email }),
    });
    const userBody = (await userRes.json()) as { message?: string } | InternalUserAuthData;
    if (!userRes.ok) {
      const message = (userBody as { message?: string }).message || 'No account found with that email';
      throw new Error(message);
    }
    const user = userBody as InternalUserAuthData;
    if (user.status !== 'active') {
      throw new Error(`Account is ${user.status}`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const otpRes = await fetch(`${config.userService.url}/api/internal/users/otp`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': config.userService.internalKey,
      },
      body: JSON.stringify({ email, otp, otp_expires_at }),
    });
    if (!otpRes.ok) {
      const otpBody = (await otpRes.json()) as { message?: string };
      throw new Error(otpBody.message || 'Failed to save OTP');
    }

    await transporter.sendMail({
      from: MAIL_FROM,
      to: user.email,
      subject: 'Password Reset OTP',
      html: otpTemplate(user.name, otp, OTP_EXPIRY_MINUTES),
    });
  } catch (error) {
    logger.error(`forgotPassword error for email ${email}: ${error}`);
    throw error;
  }
};

export const verifyOtpAndResetPassword = async (email: string, otp: string): Promise<void> => {
  try {
    const userRes = await fetch(`${config.userService.url}/api/internal/users/by-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': config.userService.internalKey,
      },
      body: JSON.stringify({ email }),
    });
    const userBody = (await userRes.json()) as { message?: string } | InternalUserAuthData;
    if (!userRes.ok) {
      const message = (userBody as { message?: string }).message || 'No account found with that email';
      throw new Error(message);
    }
    const user = userBody as InternalUserAuthData;
    if (user.status !== 'active') {
      throw new Error(`Account is ${user.status}`);
    }
    if (!user.otp_code || !user.otp_expires_at) {
      throw new Error('No OTP requested for this account');
    }
    if (user.otp_code !== otp) {
      throw new Error('Invalid OTP');
    }
    if (new Date() > new Date(user.otp_expires_at)) {
      throw new Error('OTP has expired');
    }

    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const symbols = '@$!%*?&';
    const all = lower + upper + digits + symbols;
    const rand = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
    const newPassword = [...[rand(lower), rand(upper), rand(digits), rand(symbols)], ...Array.from({ length: 5 }, () => rand(all))]
      .sort(() => Math.random() - 0.5)
      .join('');
    const password_hash = await bcrypt.hash(newPassword, 12);

    const resetRes = await fetch(`${config.userService.url}/api/internal/users/password-reset`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': config.userService.internalKey,
      },
      body: JSON.stringify({ email, password_hash }),
    });
    if (!resetRes.ok) {
      const resetBody = (await resetRes.json()) as { message?: string };
      throw new Error(resetBody.message || 'Failed to reset password');
    }

    await transporter.sendMail({
      from: MAIL_FROM,
      to: user.email,
      subject: 'Your new password',
      html: newPasswordTemplate(user.name, newPassword),
    });
  } catch (error) {
    logger.error(`verifyOtpAndResetPassword error for email ${email}: ${error}`);
    throw error;
  }
};
