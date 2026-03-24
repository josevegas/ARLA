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
    categoryIds: z.array(z.string()).optional(),
    imageUrl: z.string().nullish(),
    minPlayers: z.coerce.number().int().positive().nullish(),
    maxPlayers: z.coerce.number().int().positive().nullish(),
    difficultyId: z.string().nullish(),
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

export const tableSchema = z.object({
  body: z.object({
    capacity: z.coerce.number().int().positive(),
    description: z.string().nullish(),
    status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED']).optional(),
  }).passthrough(),
  params: z.any().optional(),
  query: z.any().optional(),
});
