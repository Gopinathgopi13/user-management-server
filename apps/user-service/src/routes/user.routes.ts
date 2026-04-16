import { Router } from 'express';
import * as userController from '@controllers/user.controller';
import { authenticate, requirePermission } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '@schemas/user.schema';

const router = Router();

router.use(authenticate);

router.post('/', requirePermission('users', 'create'), validate(createUserSchema), userController.createUser);
router.get('/', requirePermission('users', 'read'), userController.getUsers);
router.get('/stats', requirePermission('users', 'read'), userController.getStats);
router.get('/:id', requirePermission('users', 'read'), userController.getUserById);
router.put('/:id', requirePermission('users', 'update'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', requirePermission('users', 'delete'), userController.deleteUser);

router.post('/change-password', authenticate, userController.changePassword);

export default router;
