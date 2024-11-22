import { Request, Response } from 'express';
import { OrderService } from './order.service';
import zodOrderValidationSchema from './order.validation';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const zodParseOrderValidation = zodOrderValidationSchema.parse(orderData);
    const result = await OrderService.createOrderIntoDB(
      zodParseOrderValidation,
    );
    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.errors || error.message,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrdersFromDB();
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await OrderService.calculateRevenue();
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { totalRevenue },
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Something went wrong!',
      status: false,
      error: error.message,
    });
  }
};

export const OrderController = {
  createOrder,
  getAllOrders,
  getRevenue,
};
