import { z } from 'zod';

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    brand: z.string().min(1, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    price: z.number().min(0, 'Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().min(0, 'Stock must be non-negative'),
    image: z.string().min(1, 'Image URL is required'),
    description: z.string().min(1, 'Description is required'),
  }),
});
export const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    brand: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
    stock: z.number().min(0).optional(),
    image: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
