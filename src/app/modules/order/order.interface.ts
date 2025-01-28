import { Types } from 'mongoose';

export type TOrder = {
  user: Types.ObjectId;
  email: string;
  products: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    subtotal?: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'completed';
  estimatedDeliveryDate?: Date;
};
