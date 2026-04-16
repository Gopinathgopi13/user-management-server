import User from '@models/user.model';
import Role from '@models/role.model';

export type UserRepoType = typeof User & {
  findAndCountAll: (...args: unknown[]) => Promise<{ rows: unknown[]; count: number }>;
  count: (...args: unknown[]) => Promise<number>;
  findByPk: (...args: unknown[]) => Promise<any>;
  create: (...args: unknown[]) => Promise<any>;
  findOne: (...args: unknown[]) => Promise<any>;
};

export type RoleRepoType = typeof Role & {
  findAll: (...args: unknown[]) => Promise<unknown[]>;
  findByPk: (...args: unknown[]) => Promise<any>;
  create: (...args: unknown[]) => Promise<any>;
};
