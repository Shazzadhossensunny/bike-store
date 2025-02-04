import { Request, Response } from 'express';
import {
  getAuthToken,
  PaymentService,
  verifyPaymentWithShurjoPay,
} from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import axios from 'axios';
import { surjoPayConfig } from '../../config';
import { Order } from '../Order/order.model';
import mongoose from 'mongoose';

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(
    req.body.orderId,
    req.body.customerInfo,
    req as any,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

// payment.controller.ts
const handlePaymentCallback = catchAsync(
  async (req: Request, res: Response) => {
    // Handle ShurjoPay's URL formatting mistake
    const fullQuery = req.url.split('?')[1]; // Get full query string
    const params = new URLSearchParams(fullQuery.replace(/\?/g, '&')); // Replace ? with &

    const orderId = params.get('internal_order_id')!;
    const spPaymentId = params.get('order_id')!;

    // Validate only YOUR order ID format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid order ID format');
    }

    // Rest of your verification logic
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');

    const verificationData =
      await PaymentService.verifyPaymentWithShurjoPay(spPaymentId);

    // Update order status
    order.paymentStatus = 'completed';
    order.paymentInfo = {
      status: 'success',
      transactionId: verificationData.bank_trx_id,
      amount: verificationData.amount,
      currency: 'BDT',
      paidAt: new Date(),
    };
    await order.save();

    // res.redirect(`/payment-success/${orderId}`);
    res.redirect(
      `http://localhost:5173/payment-success/${orderId}?status=success`,
    );
  },
);

export const PaymentController = {
  initiatePayment,
  handlePaymentCallback,
};
