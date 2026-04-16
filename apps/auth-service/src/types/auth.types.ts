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

export type RefreshTokenRepoType = typeof RefreshToken & {
  create: (...args: unknown[]) => Promise<any>;
  findOne: (...args: unknown[]) => Promise<any>;
};
