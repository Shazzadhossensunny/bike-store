import { Types } from 'mongoose';

export type TOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export type TOrderedProduct = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type TOrder = {
  _id: string;
  user: Types.ObjectId;
  email: string;
  products: TOrderedProduct[];
  totalAmount: number;
  status: TOrderStatus;
  paymentStatus: 'pending' | 'completed';
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
  };
  paymentInfo?: {
    transactionId: string;
    paymentMethod: string;
  };
};
