import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ProductSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  productData.inStock = productData.stock > 0;
  const result = await Product.create(productData);
  return result;
};

const getAllProductDB = async (query: Record<string, unknown>) => {
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

const updateProductDB = async (id: string, payload: Partial<TProduct>) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  // Handle stock update separately
  if (payload.stock !== undefined) {
    const newStock = product.stock + payload.stock;
    if (newStock < 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Stock cannot be reduced below 0',
      );
    }
    payload.stock = newStock;
    payload.inStock = newStock > 0;
  }
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProductDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductDB,
  getSingleProductDB,
  updateProductDB,
  deleteProductDB,
};
