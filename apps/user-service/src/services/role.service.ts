import { Role } from '@models';

export const findAllRoles = async () => {
  return Role.findAll();
};

export const findRoleById = async (id: string) => {
  return Role.findByPk(id);
};

export const createRole = async (data: { name: string; permissions?: Record<string, string[]> }) => {
  return Role.create(data);
};

export const updateRole = async (
  id: string,
  data: Partial<{ name: string; permissions: Record<string, string[]> }>,
) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  return role.update(data);
};

export const deleteRole = async (id: string) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.destroy();
  return true;
};
