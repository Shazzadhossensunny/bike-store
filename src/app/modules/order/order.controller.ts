/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrderIntoDB(
    req.user?.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrdersDB(
    req.user?.userId,
    req.user?.role,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const result = await OrderService.getSingleOrderDB(
    req.params.id,
    req.user?.userId,
    req.user?.role,
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
    req.body?.status,
    req.user?.role,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.user || {};

  if (!role) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await OrderService.deleteOrderDB(id, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order deleted successfully',
    data: result,
  });
});

// const processPayment = catchAsync(async (req: Request, res: Response) => {
//   const result = await OrderService.processPayment(
//     req.params.id,
//     req.body.paymentInfo,
//   );

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Payment processed successfully',
//     data: result,
//   });
// })

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
};
