import { TProduct } from './product.interface';
import { ProductModel } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  console.log(productData);
  const result = await ProductModel.create(productData);
  return result;
};

export const ProductServices = {
  createProductIntoDB,
};
