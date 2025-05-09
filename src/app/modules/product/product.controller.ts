import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { ProductServices } from './product.service';
// create a bike
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProductIntoDB({
    ...req.body,
    createdBy: req.user.userId,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product create successfully',
    data: result,
  });
});
// get all bike
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// get single bike by id
const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProductDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});
//get category products
const getCategories = catchAsync(async (req, res) => {
  const result = await ProductServices.getCategoriesFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

//get featured products
const getFeaturedProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getFeaturedProductsDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Featured Products retrieved successfully',
    data: result,
  });
});

//update single bike by id
const updateSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProductDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteProductDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getCategories,
  getFeaturedProducts,
  updateSingleProduct,
  deleteProduct,
};
