import { z } from 'zod';

export const orderProductSchema = z.object({
  body: z.object({
    product: z.string(),
    quantity: z.number().positive('Quantity must be positive'),
    price: z.number().positive('Price must be positive'),
  }),
});
export const createOrderValidationSchema = z.object({
  body: z.object({
    products: z
      .array(orderProductSchema)
      .nonempty('At least one product is required'),
    totalAmount: z.number().positive('Total amount must be positive'),
    status: z
      .enum(['pending', 'processing', 'shipped', 'delivered'])
      .default('pending'),
    paymentStatus: z.enum(['pending', 'completed']).default('pending'),
    estimatedDeliveryDate: z.date().optional(),
  }),
});

export const updateOrderValidationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered']),
    paymentStatus: z.enum(['pending', 'completed']).optional(),
    estimatedDeliveryDate: z.date().optional(),
  }),
});
export const orderProductValidation = {
  orderProductSchema,
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
