import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '@models/user.model';
import Role from '@models/role.model';
import { UserStatus } from '@models/user.model';
import { generatePassword } from '@utils/index';
import logger from '@shared/logger';
import { sendWelcomeMail } from '@services/mail.service';
import type { UserRepoType } from '../types/common.types';

const UserRepo = User as UserRepoType;

const userWithRole = {
  attributes: { exclude: ['password_hash'] },
  include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
};

export const findAllUsers = async (
  page: number = 1,
  size: number = 10,
  filters: { search?: string; role_id?: string } = {},
) => {
  try {
    const offset = (page - 1) * size;
    const where: Record<string, unknown> = {};

    if (filters.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }
    if (filters.role_id) {
      where.role_id = filters.role_id;
    }

    const { rows, count } = await UserRepo.findAndCountAll({
      ...userWithRole,
      where,
      limit: size,
      offset,
    });
    return { data: rows, page, size, total: count };
  } catch (error) {
    logger.error(`findAllUsers error: ${error}`);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const [total, active, inactive, admins] = await Promise.all([
      UserRepo.count(),
      UserRepo.count({ where: { status: 'active' } }),
      UserRepo.count({ where: { status: 'inactive' } }),
      UserRepo.count({
        include: [
          {
            model: Role,
            as: 'role',
            where: { name: 'admin' },
            attributes: [],
          },
        ],
      }),
    ]);
    return { total, active, inactive, admins };
  } catch (error) {
    logger.error(`getUserStats error: ${error}`);
    throw error;
  }
};

export const findUserById = async (id: string) => {
  try {
    return await UserRepo.findByPk(id, userWithRole);
  } catch (error) {
    logger.error(`findUserById error for user ${id}: ${error}`);
    throw error;
  }
};

export const createUser = async (data: { name: string; email: string; role_id: string }) => {
  try {
    const generatedPassword = generatePassword();
    const password_hash = await bcrypt.hash(generatedPassword, 12);
    const user = await UserRepo.create({
      name: data.name,
      email: data.email,
      password_hash,
      role_id: data.role_id,
    });
    logger.info(`User created: ${user.id} (${data.email})`);
    await sendWelcomeMail(data.name, data.email, generatedPassword);
    return { ...(await findUserById(user.id))?.toJSON(), generatedPassword };
  } catch (error) {
    logger.error(`createUser error for email ${data.email}: ${error}`);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; status: UserStatus; role_id: string }>,
) => {
  try {
    const user = await UserRepo.findByPk(id);
    if (!user) return null;
    await user.update(data);
    logger.info(`User updated: ${id}`);
    return findUserById(id);
  } catch (error) {
    logger.error(`updateUser error for user ${id}: ${error}`);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = await UserRepo.findByPk(id);
    if (!user) return null;
    await user.destroy();
    logger.info(`User deleted: ${id}`);
    return true;
  } catch (error) {
    logger.error(`deleteUser error for user ${id}: ${error}`);
    throw error;
  }
};

export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    const user = await UserRepo.findByPk(userId);
    if (!user) throw new Error('User not found');
    if (user.status !== 'active') throw new Error(`Account is ${user.status}`);

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      logger.warn(`Password change failed for user: ${userId} — incorrect current password`);
      throw new Error('Current password is incorrect');
    }

    const password_hash = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash });
    logger.info(`Password changed for user: ${userId}`);
  } catch (error) {
    logger.error(`changeUserPassword error for user ${userId}: ${error}`);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await UserRepo.findOne({ where: { email } });
  } catch (error) {
    logger.error(`findUserByEmail error for email ${email}: ${error}`);
    throw error;
  }
};

export const setUserOtpByEmail = async (email: string, otp: string, otp_expires_at: Date): Promise<boolean> => {
  try {
    const user = await UserRepo.findOne({ where: { email } });
    if (!user) return false;
    await user.update({ otp_code: otp, otp_expires_at });
    return true;
  } catch (error) {
    logger.error(`setUserOtpByEmail error for email ${email}: ${error}`);
    throw error;
  }
};

export const resetPasswordByEmail = async (email: string, password_hash: string): Promise<boolean> => {
  try {
    const user = await UserRepo.findOne({ where: { email } });
    if (!user) return false;
    await user.update({ password_hash, otp_code: null, otp_expires_at: null });
    return true;
  } catch (error) {
    logger.error(`resetPasswordByEmail error for email ${email}: ${error}`);
    throw error;
  }
};

export const validateCredentials = async (email: string, password: string) => {
  try {
    const user = await UserRepo.findOne({
      where: { email },
      include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
    });

    if (!user) {
      logger.warn(`Credential validation failed: email not found (${email})`);
      throw new Error('Invalid credentials');
    }
    if (user.status !== 'active') {
      logger.warn(`Credential validation rejected for inactive account: ${user.id}`);
      throw new Error(`Account is ${user.status}`);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logger.warn(`Credential validation failed: wrong password for user ${user.id}`);
      throw new Error('Invalid credentials');
    }

    const { password_hash: _, ...safeUser } = user.toJSON() as unknown as Record<string, unknown>;
    return safeUser;
  } catch (error) {
    logger.error(`validateCredentials error for email ${email}: ${error}`);
    throw error;
  }
};
