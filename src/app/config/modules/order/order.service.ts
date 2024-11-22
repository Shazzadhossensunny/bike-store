import { Product } from '../product/product.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const createOrderIntoDB = async (orderData: TOrder) => {
  const { product: productId, quantity } = orderData;
  //find product
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  //check stock
  if (product.quantity < quantity) {
    throw new Error('Insufficient stock');
  }

  // Calculate total price
  const totalPrice = product.price * quantity;

  //reduce stock and update instock status
  product.quantity = product.quantity - quantity;
  //   update inStcok
  product.inStock = product.quantity > 0;
  await product.save();

  // Create order data with total price
  const orderWithTotalPrice = {
    ...orderData,
    totalPrice,
  };
  //new order save

  const newOrder = new Order(orderWithTotalPrice);
  const result = await newOrder.save();
  return result;
};

const getAllOrdersFromDB = async () => {
  return await Order.find().populate('product');
};

const calculateRevenue = async () => {
  const revenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  return revenue[0]?.totalRevenue || 0;
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  calculateRevenue,
};
