/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  console.log(userId);
  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const orderData = { ...req.body, user: userId };
  const order = await OrderService.createOrderIntoDB(orderData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getAllOrdersDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Orders retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await OrderService.getUserOrdersDB(userId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User orders retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// const getOrdersByEmail = catchAsync(async (req: Request, res: Response) => {
//   const { email } = req.params;
//   if (!email) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Email is required');
//   }

//   const orders = await OrderService.getOrdersByEmail(email);

//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Orders retrieved successfully',
//     data: orders,
//   });
// });

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.user || {};

  if (!userId || !role) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'User not authenticated');
  }

  const order = await OrderService.getSingleOrderDB(id, userId, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: order,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, estimatedDeliveryDate } = req.body;

  if (!status) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Status is required');
  }

  const order = await OrderService.updateOrderStatusDB(id, {
    status,
    estimatedDeliveryDate,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order status updated successfully',
    data: order,
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
    message: result.message,
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  // getOrdersByEmail,
};
