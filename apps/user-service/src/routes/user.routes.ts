import { Router } from 'express';
import * as userController from '@controllers/user.controller';
import { authenticate, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createUserSchema } from '@schemas/user.schema';

const router = Router();

router.use(authenticate);

router.get('/', userController.getUsers);
router.get('/stats', userController.getStats);
router.get('/:id', userController.getUserById);
router.post('/', requireAdmin, validate(createUserSchema), userController.createUser);
router.put('/:id', requireAdmin, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);

export default router;
