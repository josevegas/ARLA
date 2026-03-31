import { Router } from 'express';
import { register, login, getProfile, verifyEmail, resendVerification } from '../controllers/authController';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', validate(loginSchema), login);
router.get('/profile', auth, getProfile);

export default router;
