import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from '../Product/product.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const createOrderIntoDB = async (orderData: TOrder) => {
  console.log(orderData);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    for (const item of orderData.products) {
      const product = await Product.findById(item.product).session(session);
      if (!product || product.stock < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for product ${item.product}`,
        );
      }

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, inStock: { $gt: 0 } } },
        { session },
      );
    }

    const result = await Order.create([orderData], { session });
    await session.commitTransaction();
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrdersDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    Order.find().populate('user', 'name email').populate('products.product'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const [meta, result] = await Promise.all([
    orderQuery.countTotal(),
    orderQuery.modelQuery,
  ]);

  return { meta, result };
};

const getUserOrdersDB = async (
  userId: Types.ObjectId,
  query: Record<string, unknown>,
) => {
  const orderQuery = new QueryBuilder(
    Order.find({ user: userId })
      .populate('products.product')
      .populate('user', 'name email'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const [meta, result] = await Promise.all([
    orderQuery.countTotal(),
    orderQuery.modelQuery,
  ]);

  return { meta, result };
};

const getSingleOrderDB = async (
  orderId: string,
  userId: Types.ObjectId,
  role: string,
) => {
  const query =
    role === 'admin' ? { _id: orderId } : { _id: orderId, user: userId };

  const order = await Order.findOne(query)
    .populate('products.product')
    .populate('user', 'name email');

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

// const getOrdersByEmail = async (email: string) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   const orders = await Order.find({ user: user._id })
//     .populate('products.product')
//     .populate('user', 'name email');

//   return orders;
// };

const updateOrderStatusDB = async (
  orderId: string,
  payload: {
    status: TOrder['status'];
    estimatedDeliveryDate?: Date;
  },
) => {
  const order = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
    runValidators: true,
  })
    .populate('products.product')
    .populate('user', 'name email');

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  return order;
};

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
  getUserOrdersDB,
  getSingleOrderDB,
  updateOrderStatusDB,
  deleteOrderDB,
  // getOrdersByEmail,
};
