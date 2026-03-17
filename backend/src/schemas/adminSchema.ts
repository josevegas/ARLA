import { z } from 'zod';

export const menuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().positive(),
    category: z.string(),
    available: z.boolean().optional(),
  }),
});

export const gameSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    category: z.string().optional(),
    minPlayers: z.number().int().positive().optional(),
    maxPlayers: z.number().int().positive().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    duration: z.number().int().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
  }),
});

export const promotionSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string(),
    discount: z.number().positive(),
    expirationDate: z.string().transform((val) => new Date(val)),
    active: z.boolean().optional(),
  }),
});
