import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    tableId: z.string().uuid('Invalid table ID format').or(z.string().cuid()),
    date: z.string().transform((val) => new Date(val)),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    peopleCount: z.number().int().min(1, 'At least 1 person required').max(20, 'Max 20 people per reservation'),
    prepayment: z.boolean().optional().default(false),
  }),
});

export const updateReservationSchema = z.object({
  body: createReservationSchema.shape.body.partial(),
  params: z.object({
    id: z.string().cuid().or(z.string().uuid()),
  }),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>['body'];
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>['body'];