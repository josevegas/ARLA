import { Router } from 'express';
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from '../controllers/reservationController';
import { validate } from '../middlewares/validation';
import { createReservationSchema, updateReservationSchema } from '../types/reservation';

const router = Router();

router.post('/', validate(createReservationSchema), createReservation);
router.get('/', getReservations);
router.get('/:id', getReservationById);
router.put('/:id', validate(updateReservationSchema), updateReservation);
router.delete('/:id', deleteReservation);

export default router;