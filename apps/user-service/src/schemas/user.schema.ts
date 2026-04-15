import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  role_id: z.string().uuid('role_id must be a valid UUID'),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100).optional(),
    email: z.string().email('Invalid email address').optional(),
    status: z.enum(['active', 'inactive', 'banned']).optional(),
    role_id: z.string().uuid('role_id must be a valid UUID').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
