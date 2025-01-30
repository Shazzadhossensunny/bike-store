import { Types } from 'mongoose';

export interface TOrderProduct {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface TShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface TPaymentInfo {
  status: 'pending' | 'initiated' | 'success' | 'failed';
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
  paidAmount?: number;
  paidAt?: Date;
  failureReason?: string;
  paymentDate?: string;
}

export interface TOrder {
  _id: Types.ObjectId;
  paymentOrderId?: string;
  user: Types.ObjectId;
  products: TOrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'delivered';
  paymentStatus: 'pending' | 'initiated' | 'completed' | 'failed';
  shippingAddress: TShippingAddress;
  paymentInfo: TPaymentInfo;
  createdAt?: Date;
  updatedAt?: Date;
}
