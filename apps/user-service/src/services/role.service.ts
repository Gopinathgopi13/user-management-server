import Role from '@models/role.model';
import logger from '@utils/logger';
import type { RoleRepoType } from '../types/common.types';

const RoleRepo = Role as RoleRepoType;

export const findAllRoles = async () => {
  try {
    return await RoleRepo.findAll();
  } catch (error) {
    logger.error(`findAllRoles error: ${error}`);
    throw error;
  }
};

export const findRoleById = async (id: string) => {
  try {
    return await RoleRepo.findByPk(id);
  } catch (error) {
    logger.error(`findRoleById error for role ${id}: ${error}`);
    throw error;
  }
};

export const createRole = async (data: { name: string; permissions?: Record<string, string[]> }) => {
  try {
    const role = await RoleRepo.create(data);
    logger.info(`Role created: ${role.id} (${data.name})`);
    return role;
  } catch (error) {
    logger.error(`createRole error for role ${data.name}: ${error}`);
    throw error;
  }
};

export const updateRole = async (
  id: string,
  data: Partial<{ name: string; permissions: Record<string, string[]> }>,
) => {
  try {
    const role = await RoleRepo.findByPk(id);
    if (!role) return null;
    const updated = await role.update(data);
    logger.info(`Role updated: ${id}`);
    return updated;
  } catch (error) {
    logger.error(`updateRole error for role ${id}: ${error}`);
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    const role = await RoleRepo.findByPk(id);
    if (!role) return null;
    await role.destroy();
    logger.info(`Role deleted: ${id}`);
    return true;
  } catch (error) {
    logger.error(`deleteRole error for role ${id}: ${error}`);
    throw error;
  }
};
