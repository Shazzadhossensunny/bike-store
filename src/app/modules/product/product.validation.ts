import { z } from 'zod';

const productValidationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  brand: z.string().min(2, 'Brand name must be at least 2 characters long'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
    errorMap: () => ({
      message: 'Category must be one of Mountain, Road, Hybrid, or Electric',
    }),
  }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  inStock: z.boolean().default(true),
});

export default productValidationSchema;
