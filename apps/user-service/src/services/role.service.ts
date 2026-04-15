import { Role } from '@models';
import logger from '@utils/logger';

export const findAllRoles = async () => {
  return Role.findAll();
};

export const findRoleById = async (id: string) => {
  return Role.findByPk(id);
};

export const createRole = async (data: { name: string; permissions?: Record<string, string[]> }) => {
  const role = await Role.create(data);
  logger.info(`Role created: ${role.id} (${data.name})`);
  return role;
};

export const updateRole = async (
  id: string,
  data: Partial<{ name: string; permissions: Record<string, string[]> }>,
) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  const updated = await role.update(data);
  logger.info(`Role updated: ${id}`);
  return updated;
};

export const deleteRole = async (id: string) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.destroy();
  logger.info(`Role deleted: ${id}`);
  return true;
};
