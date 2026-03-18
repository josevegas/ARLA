import { z } from 'zod';

export const menuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().nullish(),
    price: z.coerce.number().positive(),
    category: z.string(),
    available: z.boolean().optional(),
    imageUrl: z.string().nullish()
  }).passthrough(),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const gameSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().nullish(),
    category: z.string().nullish(),
    imageUrl: z.string().nullish(),
    minPlayers: z.coerce.number().int().positive().nullish(),
    maxPlayers: z.coerce.number().int().positive().nullish(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).nullish(),
    duration: z.coerce.number().int().positive().nullish(),
    stock: z.coerce.number().int().nonnegative().optional(),
  }).passthrough(),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const promotionSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().nullish(),
    discount: z.coerce.number().nonnegative(),
    expirationDate: z.coerce.date(),
    imageUrl: z.string().nullish(),
    active: z.boolean().optional(),
  }).passthrough(),
  params: z.any().optional(),
  query: z.any().optional(),
});
