import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../Product/product.model';
import { TOrder, TOrderStatus } from './order.interface';
import { Order } from './order.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createOrderIntoDB = async (userId: string, payload: Partial<TOrder>) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check stock and calculate total amount
    const { products, shippingAddress } = payload;
    let totalAmount = 0;

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

      // Update stock
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session, new: true },
      );

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = await Order.create(
      [
        {
          user: userId,
          products,
          totalAmount,
          shippingAddress,
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

// const getAllOrdersDB = async (query: Record<string, unknown>) => {
//   const orderQuery = new QueryBuilder(
//     Order.find().populate('user', 'name email').populate('products.product'),
//     query,
//   )
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const [meta, result] = await Promise.all([
//     orderQuery.countTotal(),
//     orderQuery.modelQuery,
//   ]);

//   return { meta, result };
// };
const getAllOrdersDB = async (userId: string, role: string) => {
  const query = role === 'admin' ? {} : { user: userId };
  const orders = await Order.find(query).populate('user', 'name email');
  return orders;
};

const getSingleOrderDB = async (
  orderId: string,
  userId: string,
  role: string,
) => {
  const query =
    role === 'admin' ? { _id: orderId } : { _id: orderId, user: userId };
  const order = await Order.findOne(query).populate('user', 'name email');

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

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

// const processPayment = async (orderId: string, paymentInfo: any) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();

//     const order = await Order.findById(orderId).session(session);
//     if (!order) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
//     }

//     // Here you would integrate with SurjoPay
//     // For now, we'll just update the payment status
//     order.paymentStatus = 'completed';
//     order.paymentInfo = paymentInfo;
//     await order.save({ session });

//     await session.commitTransaction();
//     return order;
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

const deleteOrderDB = async (orderId: string, role: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  // Only allow deletion for admins
  if (role !== 'admin') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this order',
    );
  }

  await Order.findByIdAndDelete(orderId);

  return { message: 'Order successfully deleted' };
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrdersDB,
  getSingleOrderDB,
  updateOrderStatusDB,
  deleteOrderDB,
};
