import { Router } from 'express';
import { getUserHistory } from '../controllers/userController';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/history', auth, getUserHistory);

export default router;
