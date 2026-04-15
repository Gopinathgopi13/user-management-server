import { Router } from 'express';
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '@controllers/role.controller';
import { authenticate, requireAdmin } from '@middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getRoles);
router.get('/:id', getRoleById);
router.post('/', requireAdmin, createRole);
router.put('/:id', requireAdmin, updateRole);
router.delete('/:id', requireAdmin, deleteRole);

export default router;
