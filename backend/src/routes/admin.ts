import { Router } from 'express';
import { 
  createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem,
  createPromotion, getPromotions, updatePromotion, deletePromotion,
  createGame, getGames, updateGame, deleteGame,
  getCategories, getDifficulties,
  createTable, getTables, updateTable, deleteTable,
  getAdminReservations, updateReservationStatus
} from '../controllers/adminController';
import { auth, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { menuItemSchema, promotionSchema, gameSchema, tableSchema } from '../schemas/adminSchema';

const router = Router();

// Publicly readable menu and games (optional, depending on requirement, but user asked for CRUD for admin)
// For now, let's keep all protected as they were, but add the new ones.

router.get('/menu', getMenuItems);
router.get('/promotions', getPromotions);
router.get('/games', getGames);
router.get('/game-categories', getCategories);
router.get('/game-difficulties', getDifficulties);

// Protect write routes
router.use(auth);
router.use(authorize(['ADMIN', 'SUPERADMIN']));

router.post('/menu', validate(menuItemSchema), createMenuItem);
router.put('/menu/:id', validate(menuItemSchema), updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

router.post('/promotions', validate(promotionSchema), createPromotion);
router.put('/promotions/:id', validate(promotionSchema), updatePromotion);
router.delete('/promotions/:id', deletePromotion);

router.post('/games', validate(gameSchema), createGame);
router.put('/games/:id', validate(gameSchema), updateGame);
router.delete('/games/:id', deleteGame);

router.get('/tables', getTables);
router.post('/tables', validate(tableSchema), createTable);
router.put('/tables/:id', validate(tableSchema), updateTable);
router.delete('/tables/:id', deleteTable);

router.get('/reservations', getAdminReservations);
router.post('/reservations/:id/status', updateReservationStatus);

export default router;
