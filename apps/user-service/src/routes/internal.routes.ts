import { Router } from 'express';
import { getUserById, validateCredentials } from '@controllers/user.controller';
import { internalKeyGuard } from '@middlewares/auth.middleware';

const router = Router();

router.use(internalKeyGuard);

router.post('/validate', validateCredentials);
router.get('/users/:id', getUserById);

export default router;
