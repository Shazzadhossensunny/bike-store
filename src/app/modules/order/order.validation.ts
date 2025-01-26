import { Types } from 'mongoose';
import { z } from 'zod';

const orderValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  product: z
    .string()
    .refine((value) => Types.ObjectId.isValid(value), {
      message: 'Invalid product ID',
    })
    .transform((value) => new Types.ObjectId(value)),
  quantity: z
    .number()
    .int()
    .positive({ message: 'Quantity must be a positive integer' }),
  totalPrice: z.number().positive({ message: 'Total price must be positive' }),
});

export default orderValidationSchema;
