import { Router } from 'express';
import {
  getUserById,
  validateCredentials,
  getUserByEmail,
  updateUserOtp,
  resetUserPassword,
} from '@controllers/user.controller';
import { internalKeyGuard } from '@middlewares/auth.middleware';

const router = Router();

router.use(internalKeyGuard);

router.post('/validate', validateCredentials);
router.get('/users/:id', getUserById);
router.post('/users/by-email', getUserByEmail);
router.patch('/users/otp', updateUserOtp);
router.patch('/users/password-reset', resetUserPassword);

export default router;
