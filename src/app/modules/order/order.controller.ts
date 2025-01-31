import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

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
    req.user?.id,
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
    req.params.orderId,
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
    req.params.orderId,
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
    req.params.orderId,
    req.user.role,
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
};
