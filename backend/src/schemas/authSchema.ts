import { z } from 'zod';

const birthdayRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name is required'),
    lastName: z.string().min(2, 'Last name is required').optional(),
    phone: z.string().min(7, 'Phone number is required').optional(),
    birthday: z.string().regex(birthdayRegex, 'Birthday must be in DD/MM format').optional(),
    role: z.enum(['SUPERADMIN', 'ADMIN', 'STAFF', 'CLIENT']).optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});
