import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, Role } from '@models';
import { UserStatus } from '@models/user.model';
import { generatePassword } from '@utils/index';

const userWithRole = {
  attributes: { exclude: ['password_hash'] },
  include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
};

export const findAllUsers = async (
  page: number = 1,
  size: number = 10,
  filters: { search?: string; role_id?: string } = {},
) => {
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

  const { rows, count } = await User.findAndCountAll({
    ...userWithRole,
    where,
    limit: size,
    offset,
  });
  return { data: rows, page, size, total: count };
};

export const getUserStats = async () => {
  const total = await User.count();
  const active = await User.count({ where: { status: 'active' } });
  const inactive = await User.count({ where: { status: 'inactive' } });
  const admins = await User.count({
    include: [
      {
        model: Role,
        as: 'role',
        where: { name: 'admin' },
        attributes: [],
      },
    ],
  });
  return { total, active, inactive, admins };
};

export const findUserById = async (id: string) => {
  return User.findByPk(id, userWithRole);
};

export const createUser = async (data: { name: string; email: string; role_id: string }) => {
  const generatedPassword = generatePassword();
  console.log(generatedPassword, "---> Password");
  const password_hash = await bcrypt.hash(generatedPassword, 12);
  const user = await User.create({
    name: data.name,
    email: data.email,
    password_hash,
    role_id: data.role_id,
  });
  return { ...(await findUserById(user.id))?.toJSON(), generatedPassword };
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; status: UserStatus; role_id: string }>,
) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(data);
  return findUserById(id);
};

export const deleteUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};

export const changeUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  if (user.status !== 'active') throw new Error(`Account is ${user.status}`);

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) throw new Error('Current password is incorrect');

  const password_hash = await bcrypt.hash(newPassword, 12);
  await user.update({ password_hash });
};

export const validateCredentials = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, as: 'role', attributes: ['id', 'name', 'permissions'] }],
  });

  if (!user) throw new Error('Invalid credentials');
  if (user.status !== 'active') throw new Error(`Account is ${user.status}`);

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid credentials');

  const { password_hash: _, ...safeUser } = user.toJSON() as unknown as Record<string, unknown>;
  return safeUser;
};
