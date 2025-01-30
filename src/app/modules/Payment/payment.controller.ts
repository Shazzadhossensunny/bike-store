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
    req.body.customer,
    req as any,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

// const handlePaymentCallback = catchAsync(

//   async (req: Request, res: Response) => {
//     // Get ShurjoPay's payment ID from query params
//     const orderId = req.query.order_id as string;
//     const paymentId = req.query.payment_id as string;

//     // 2. Validate order ID format
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid order ID');
//     }

//     if (!orderId) {
//       console.error('Order not found for payment ID:', orderId);
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Order not found');
//     }
//     // 2. Find order in database
//     const order = await Order.findById(orderId);
//     if (!order) throw new AppError(404, 'Order not found');

//     try {
//       // 1. Get fresh authentication token
//       const authResponse = await getAuthToken();
//       console.log('Auth token obtained:', authResponse.token);

//       // 2. Verify payment with ShurjoPay

//       const verificationResponse = await axios.post(
//         `${surjoPayConfig.SP_ENDPOINT}/verification`,
//         { order_id: paymentId },
//         {
//           headers: {
//             Authorization: `Bearer ${authResponse.token}`,
//           },
//         },
//       );

//       // 3. Check verification status
//       const verificationData = verificationResponse.data[0];
//       // if (!verificationData || verificationData.sp_code !== 1000) {
//       //   console.error("Empty verification response");
//       //   console.error(
//       //     'Verification failed. Full response:',
//       //     verificationResponse.data,
//       //   );
//       //   throw new AppError(
//       //     StatusCodes.BAD_REQUEST,
//       //     `Payment verification failed: ${verificationData?.sp_message || 'Unknown error'}`,
//       //   );
//       // }
//       if (!verificationData) {
//         console.error('Empty verification response');
//         throw new Error('Payment verification failed: No data received');
//       }

//       console.log(
//         'Verification Data:',
//         JSON.stringify(verificationData, null, 2),
//       );

//       if (verificationData.sp_code !== 1000) {
//         throw new AppError(
//           StatusCodes.BAD_REQUEST,
//           `Payment failed: ${verificationData.sp_message} (Code: ${verificationData.sp_code})`,
//         );
//       }

//       // 4. Update order status
//       console.log('Updating order status for:', order);
//       // const result = await PaymentService.handlePaymentSuccess(
//       //   verificationResponse.data.transactionId,
//       //   paymentId,
//       // );

//       order.paymentStatus = 'completed';
//       order.paymentInfo = {
//         status: 'success',
//         transactionId: verificationData.bank_trx_id,
//         amount: verificationData.amount,
//         currency: 'BDT',
//         paidAt: new Date(),
//       };
//       await order.save();

//       res.redirect('/payment-success');
//     } catch (error) {
//       console.error('Payment callback error:', error);
//       throw error;
//     }
//   },
// );

const handlePaymentCallback = catchAsync(
  async (req: Request, res: Response) => {
    const orderId = req.query.internal_order_id as string; // Updated name
    const spaymentId = req.query.order_id as string; // Updated name

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid order ID format');
    }

    const verificationData = await verifyPaymentWithShurjoPay(spaymentId);

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'completed',
        paymentInfo: {
          status: 'success',
          transactionId: verificationData.bank_trx_id,
          amount: verificationData.amount,
          currency: 'BDT',
          paidAt: new Date(),
        },
      },
      { new: true },
    );
    res.redirect('/payment-success');
  },
);
export const PaymentController = {
  initiatePayment,
  handlePaymentCallback,
};
