import { z } from 'zod';
const userValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['customer', 'admin']).optional(),
});

const changePasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string().min(6, 'Old password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
  }),
});
export const UserValidation = {
  userValidationSchema,
  changePasswordValidation,
};
