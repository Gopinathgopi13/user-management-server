import { Router } from 'express';
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '@controllers/role.controller';
import { authenticate, requirePermission } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createRoleSchema, updateRoleSchema } from '@schemas/role.schema';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('roles', 'read'), getRoles);
router.get('/:id', requirePermission('roles', 'read'), getRoleById);
router.post('/', requirePermission('roles', 'write'), validate(createRoleSchema), createRole);
router.put('/:id', requirePermission('roles', 'write'), validate(updateRoleSchema), updateRole);
router.delete('/:id', requirePermission('roles', 'delete'), deleteRole);

export default router;
