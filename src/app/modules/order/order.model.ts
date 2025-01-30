import { Schema, model } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    paymentOrderId: {
      type: String,
      sparse: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'confirmed', 'cancelled', 'delivered'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'initiated', 'completed', 'failed'],
      default: 'pending',
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    paymentInfo: {
      status: {
        type: String,
        enum: ['pending', 'initiated', 'success', 'failed'],
        default: 'pending',
      },
      transactionId: String,
      paymentMethod: {
        type: String,
        default: 'surjopay',
      },
      amount: Number,
      currency: {
        type: String,
        default: 'BDT',
      },
      paidAmount: Number,
      paidAt: Date,
      failureReason: String,
      paymentDate: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, status: 1 });
orderSchema.index({ paymentOrderId: 1 }, { sparse: true });
orderSchema.index({ 'paymentInfo.transactionId': 1 }, { sparse: true });

export const Order = model<TOrder>('Order', orderSchema);
