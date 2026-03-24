import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    tableId: z.string().uuid('Invalid table ID format').or(z.string().cuid()),
    date: z.string().transform((val) => new Date(val)),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    peopleCount: z.number().int().min(1, 'At least 1 person required').max(20, 'Max 20 people per reservation'),
    playerNames: z.array(z.string()).min(1, 'At least one player name required'),
    prepayment: z.boolean().optional().default(false),
    shareTable: z.boolean().optional().default(false),
    gameIds: z.array(z.string()).max(2, 'Max 2 games').optional(),
  }).passthrough(),
});

export const updateReservationSchema = z.object({
  body: createReservationSchema.shape.body.partial(),
  params: z.object({
    id: z.string().cuid().or(z.string().uuid()),
  }),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>['body'];
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>['body'];

export const findTableSchema = z.object({
  body: z.object({
    date: z.string().transform((val) => new Date(val)),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
    peopleCount: z.number().int().min(1).max(20),
    shareTable: z.boolean().optional().default(false),
  }),
});
export type FindTableInput = z.infer<typeof findTableSchema>['body'];