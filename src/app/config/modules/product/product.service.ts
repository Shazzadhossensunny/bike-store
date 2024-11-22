import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

const getAllProductDB = async (searchTerm?: string) => {
  let query = {};

  if (searchTerm) {
    query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
      ],
    };
  }

  const result = await Product.find(query);
  // Check if result is empty
  if (result.length === 0) {
    throw new Error('No products found matching the search criteria.');
  }
  return result;
};

const getSingleProductDB = async (productId: string) => {
  const result = await Product.findById(productId);
  return result;
};

const updateProductDB = async (productId: string, data: Partial<TProduct>) => {
  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    throw new Error('Product not found');
  }
  // If quantity is being updated, modify inStock status
  if (data.quantity !== undefined) {
    data.inStock = data.quantity > 0;
  }
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
