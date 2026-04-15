import { Router } from 'express';
import * as userController from '@controllers/user.controller';
import { authenticate, requirePermission } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createUserSchema } from '@schemas/user.schema';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('users', 'read'), userController.getUsers);
router.get('/stats', requirePermission('users', 'read'), userController.getStats);
router.get('/:id', requirePermission('users', 'read'), userController.getUserById);
router.post('/', requirePermission('users', 'write'), validate(createUserSchema), userController.createUser);
router.put('/:id', requirePermission('users', 'write'), userController.updateUser);
router.delete('/:id', requirePermission('users', 'delete'), userController.deleteUser);

export default router;
