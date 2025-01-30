import mongoose from 'mongoose';
import { TOrder } from './order.interface';
import { Product } from '../Product/product.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { Order } from './order.model';
import { SurjoPayCustomer } from '../Payment/payment.interface';
import { PaymentService } from '../Payment/payment.service';

const createOrderIntoDB = async (userId: string, payload: Partial<TOrder>) => {
  // Validate userId
  if (!userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User ID is required');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { products, shippingAddress } = payload;
    let totalAmount = 0;

    // Create an array to store the complete product information
    const orderProducts = [];

    // Process each product
    for (const item of products!) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `Product ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for product ${product.name}`,
        );
      }

      // Update product stock
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session, new: true },
      );

      // Calculate total amount and store complete product info
      totalAmount += product.price * item.quantity;
      orderProducts.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Create the order with complete product information
    const order = await Order.create(
      [
        {
          user: userId,
          products: orderProducts,
          totalAmount,
          shippingAddress,
          status: 'pending',
          paymentStatus: 'pending',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const initiatePaymentDB = async (
  orderId: string,
  customerInfo: SurjoPayCustomer,
) => {
  console.log('Initiating payment for order:', orderId);
  console.log('Customer info:', customerInfo);

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  console.log('Found order:', order);

  if (order.paymentStatus === 'completed') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Order is already paid');
  }

  try {
    const paymentResponse = await PaymentService.initiatePayment(
      orderId,
      customerInfo,
    );

    console.log('Surjopay response:', paymentResponse);
    order.paymentOrderId = paymentResponse.paymentId;
    await order.save();

    return {
      paymentUrl: paymentResponse.paymentUrl,
      paymentId: paymentResponse.paymentId,
      orderId: order._id,
    };
  } catch (error) {
    console.error('Error from Surjopay:', error);
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Failed to initiate payment: ' + (error.message || 'Unknown error'),
    );
  }
};

const getAllOrdersDB = async (userId: string, role: string) => {
  const query = role === 'admin' ? {} : { user: userId };
  return await Order.find(query)
    .populate('user', 'name email')
    .populate('products.productId', 'name brand price')
    .sort({ createdAt: -1 });
};

const getSingleOrderDB = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const query =
    role === 'admin' ? { _id: orderId } : { _id: orderId, user: userId };
  const order = await Order.findOne(query)
    .populate('user', 'name email')
    .populate('products.productId', 'name brand price');

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

const updateOrderStatusDB = async (
  orderId: string,
  status: TOrderStatus,
  role: string,
) => {
  if (role !== 'admin') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Only admin can update order status',
    );
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order.paymentStatus !== 'completed' && status !== 'cancelled') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Cannot update status until payment is completed',
    );
  }

  order.status = status;
  await order.save();

  return order.populate('products.productId', 'name brand price');
};

const deleteOrderDB = async (orderId: string, role: string) => {
  if (role !== 'admin') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this order',
    );
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (order.paymentStatus === 'completed') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete order with completed payment',
    );
  }

  await order.deleteOne();
  return order;
};

export const OrderService = {
  createOrderIntoDB,
  initiatePaymentDB,
  getAllOrdersDB,
  getSingleOrderDB,
  updateOrderStatusDB,
  deleteOrderDB,
};
