import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ProductSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { Order } from '../Order/order.model';

const createProductIntoDB = async (productData: TProduct) => {
  const existingProduct = await Product.findOne({
    name: productData.name,
    model: productData.model,
  });

  if (existingProduct) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Product with the same name and model already exists',
    );
  }
  const result = await Product.create(productData);
  return result;
};

const getAllProductsDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleProductDB = async (id: string) => {
  const result = await Product.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return result;
};

const getFeaturedProductsDB = async () => {
  const result = await Product.find().limit(6);
  return result;
};

const updateProductDB = async (id: string, payload: Partial<TProduct>) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  // Handle stock update separately
  if (payload.stock !== undefined) {
    if (payload.stock < 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Stock cannot be negative');
    }
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { ...payload, stock: payload.stock ?? product.stock }, // Ensure stock updates correctly
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

const deleteProductDB = async (id: string) => {
  const existingOrders = await Order.findOne({ product: id });

  if (existingOrders) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Cannot delete product with existing orders',
    );
  }

  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsDB,
  getSingleProductDB,
  getFeaturedProductsDB,
  updateProductDB,
  deleteProductDB,
};
