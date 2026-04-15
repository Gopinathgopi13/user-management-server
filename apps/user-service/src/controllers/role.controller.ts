import { Request, Response } from 'express';
import * as roleService from '@services/role.service';
import logger from '@utils/logger';

export const getRoles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const roles = await roleService.findAllRoles();
    res.json({
      status: true,
      message: 'Roles list fetched successful',
      data: roles,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch roles';
    logger.error(`getRoles error: ${message}`);
    res.status(500).json({ status: false, message });
  }
};

export const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await roleService.findRoleById(req.params.id as string);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch role';
    logger.error(`getRoleById error: ${message}`);
    res.status(500).json({ message });
  }
};

export const createRole = async (req: Request, res: Response): Promise<void> => {
  const { name, permissions } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Role name is required' });
    return;
  }
  try {
    const role = await roleService.createRole({ name, permissions });
    res.status(201).json(role);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create role';
    logger.error(`createRole error: ${message}`);
    res.status(409).json({ message });
  }
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await roleService.updateRole(req.params.id as string, req.body);
    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update role';
    logger.error(`updateRole error: ${message}`);
    res.status(400).json({ message });
  }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await roleService.deleteRole(req.params.id as string);
    if (!result) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete role';
    logger.error(`deleteRole error: ${message}`);
    res.status(500).json({ message });
  }
};
