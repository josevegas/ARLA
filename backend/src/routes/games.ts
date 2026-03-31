import { Router } from 'express';
import { purchaseGames } from '../controllers/adminController';
import { auth } from '../middlewares/auth';

const router = Router();

// This is for clients buying games
router.post('/purchase', auth, purchaseGames);

export default router;
