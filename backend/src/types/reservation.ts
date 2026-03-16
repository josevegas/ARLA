import { z } from 'zod';

export const createReservationSchema = z.object({
  userId: z.string().optional(),
  tableId: z.string(),
  date: z.string().transform((str) => new Date(str)),
  time: z.string(),
  peopleCount: z.number().int().positive(),
  prepayment: z.boolean().optional(),
});

export const updateReservationSchema = createReservationSchema.partial();