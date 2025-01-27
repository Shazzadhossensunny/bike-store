import { z } from 'zod';

export const productValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    brand: z.string().min(1, 'Brand is required'),
    price: z.number().positive('Price must be greater than 0'),
    model: z.string().min(1, 'Model is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().url('Invalid image URL'),
  }),
});
export const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required').optional(),
    brand: z.string().min(1, 'Brand is required').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    model: z.string().min(1, 'Model is required').optional(),
    stock: z
      .number()
      .int()
      .nonnegative('Stock must be a non-negative integer')
      .optional(),
    category: z.string().min(1, 'Category is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

export const ProductValidation = {
  productValidationSchema,
  updateProductValidationSchema,
};
