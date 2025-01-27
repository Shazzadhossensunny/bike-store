import { z } from 'zod';
const userValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['customer', 'admin']).optional(),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  role: z.enum(['customer', 'admin']).optional(),
});

export const UserValidation = {
  userValidationSchema,
  userUpdateSchema,
};
