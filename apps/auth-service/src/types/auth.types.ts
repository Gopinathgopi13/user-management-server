import { RefreshToken } from '@models';

export interface UserInfo {
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

export interface InternalUserAuthData {
  id: string;
  name: string;
  email: string;
  status: string;
  otp_code: string | null;
  otp_expires_at: string | null;
}

export type RefreshTokenRepoType = typeof RefreshToken & {
  create: (...args: unknown[]) => Promise<any>;
  findOne: (...args: unknown[]) => Promise<any>;
};
