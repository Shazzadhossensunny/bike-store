import { z } from 'zod';

export const createOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      }),
    ),
    shippingAddress: z.object({
      address: z.string().min(1, 'Address is required'),
      city: z.string().min(1, 'City is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
    }),
  }),
});

export const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered']),
  }),
});
export const orderProductValidation = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
