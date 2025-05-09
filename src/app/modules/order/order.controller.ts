import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrderIntoDB(req.user?.id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.initiatePaymentDB(
    req.params?.orderId,
    req.body,
    req,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Payment initiated successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrdersDB(
    req.query,
    req.user?.id,
    req.user?.role,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
// const getMyOrders = catchAsync(async (req, res) => {
//   // Get user ID from verified auth middleware
//   const userId = req.user?.userId;

//   if (!userId) {
//     return sendResponse(res, {
//       statusCode: StatusCodes.UNAUTHORIZED,
//       success: false,
//       message: 'Authentication required to view orders',
//       data: null,
//     });
//   }

//   // Make sure userId is a valid ObjectId before passing to service
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return sendResponse(res, {
//       statusCode: StatusCodes.BAD_REQUEST,
//       success: false,
//       message: 'Invalid user ID format',
//       data: null,
//     });
//   }

//   const result = await OrderService.getMyOrdersDB(userId);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Orders retrieved successfully',
//     data: result.data,
//   });
// });
const getSingleOrder = catchAsync(async (req, res) => {
  const result = await OrderService.getSingleOrderDB(
    req.params.id,
    req.user.id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const result = await OrderService.updateOrderStatusDB(
    req.params.id,
    req.body.status,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.deleteOrderDB(
    req.params.id,
    req.user.role,
    req.user.userId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  initiatePayment,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  // getMyOrders,
};
