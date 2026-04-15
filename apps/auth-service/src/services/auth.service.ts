import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { RefreshToken } from '@models';
import config from '@config';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  status: string;
  role: {
    id: string;
    name: string;
    permissions: Record<string, string[]>;
  };
}

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
    throw new Error(body.message || 'Invalid credentials');
  }

  const user = (await response.json()) as UserInfo;

  const rawToken = generateRefreshToken();
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.refreshToken.expiresInDays);

  await RefreshToken.create({
    user_id: user.id,
    token: hashedToken,
    expires_at: expiresAt,
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken: rawToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role.name },
  };
};

export const refresh = async (rawToken: string) => {
  const hashedToken = hashToken(rawToken);
  const record = await RefreshToken.findOne({ where: { token: hashedToken } });

  if (!record) throw new Error('Invalid refresh token');
  if (record.is_revoked) throw new Error('Refresh token has been revoked');
  if (record.expires_at < new Date()) throw new Error('Refresh token has expired');

  // Revoke old token and issue a new one (rotation)
  await record.update({ is_revoked: true });

  const response = await fetch(`${config.userService.url}/api/internal/users/${record.user_id}`, {
    headers: { 'X-Internal-Key': config.userService.internalKey },
  });

  if (!response.ok) throw new Error('User not found');
  const user = (await response.json()) as UserInfo;

  if (user.status !== 'active') throw new Error('Account is not active');

  const newRawToken = generateRefreshToken();
  const newHashedToken = hashToken(newRawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.refreshToken.expiresInDays);

  await RefreshToken.create({
    user_id: user.id,
    token: newHashedToken,
    expires_at: expiresAt,
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken: newRawToken,
  };
};

export const logout = async (rawToken: string) => {
  const hashedToken = hashToken(rawToken);
  const record = await RefreshToken.findOne({ where: { token: hashedToken } });
  if (!record) throw new Error('Invalid refresh token');
  await record.update({ is_revoked: true });
};
