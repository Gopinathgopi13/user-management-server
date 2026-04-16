import { Router } from 'express';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import internalRoutes from './internal.routes';

const router = Router();

router.use('/internal', internalRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

export default router;
