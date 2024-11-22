import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

const getAllProductDB = async () => {
  const result = await Product.find();
  return result;
};

const getSingleProductDB = async (productId: string) => {
  const result = await Product.findById(productId);
  return result;
};

const updateProductDB = async (productId: string, data: Partial<TProduct>) => {
  const result = await Product.findByIdAndUpdate(productId, data, {
    new: true,
  });
  return result;
};

const deleteProductDB = async (productId: string) => {
  const result = await Product.findByIdAndDelete(productId);
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductDB,
  getSingleProductDB,
  updateProductDB,
  deleteProductDB,
};
