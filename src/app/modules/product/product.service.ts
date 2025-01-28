import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ProductSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { SortOrder } from 'mongoose';

const createProductIntoDB = async (productData: TProduct) => {
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
// const getAllProductsDB = async (
//   filters: Record<string, unknown>,
//   sort: Record<string, SortOrder>,
//   limit: number,
//   page: number,
// ) => {
//   const { searchTerm, ...filterData } = filters;

//   const conditions = [];

//   if (searchTerm) {
//     conditions.push({
//       $or: ['name', 'brand', 'model', 'category'].map((field) => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }

//   if (Object.keys(filterData).length) {
//     conditions.push({
//       $and: Object.entries(filterData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const whereConditions = conditions.length > 0 ? { $and: conditions } : {};

//   const result = await Product.find(whereConditions)
//     .sort(sort)
//     .skip((page - 1) * limit)
//     .limit(limit);

//   const total = await Product.countDocuments(whereConditions);

//   return {
//     data: result,
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit),
//   };
// };

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
  getAllProductsDB,
  getSingleProductDB,
  updateProductDB,
  deleteProductDB,
};
