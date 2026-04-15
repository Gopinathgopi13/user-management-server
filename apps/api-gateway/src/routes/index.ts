import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import rolesRoutes from './roles.routes';

const router = Router();

router.use('/api', authRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/roles', rolesRoutes);

export default router;
