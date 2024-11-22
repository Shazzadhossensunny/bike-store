import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import productValidationSchema from './product.validation';
// create a bike
const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const zodParseValidation = productValidationSchema.parse(productData);
    // same name product find and if same name product find then it return
    // const existingProduct = await Product.findOne({
    //   name: zodParseValidation.name,
    // });
    // if (existingProduct) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Product name already exists. Please use a different name.',
    //   });
    // }
    //new product create
    const result =
      await ProductServices.createProductIntoDB(zodParseValidation);
    res.status(200).json({
      success: true,
      message: 'Bike created successfully!',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({
      message: 'Validation failed',
      success: false,
      error,
    });
  }
};

// get all bike
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;
    const result = await ProductServices.getAllProductDB(searchTerm as string);
    res.status(200).json({
      success: true,
      message: 'Bikes retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Validation failed',
      success: false,
      error,
    });
  }
};

// get single bike by id
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const result = await ProductServices.getSingleProductDB(id);
    res.status(200).json({
      success: true,
      message: 'Bike retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Validation failed',
      success: false,
      error,
    });
  }
};

//update single bike by id
const updateSingleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    const data = req.body;
    const result = await ProductServices.updateProductDB(id, data);
    res.status(200).json({
      success: true,
      message: 'Bike updated successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Validation failed',
      success: false,
      error,
    });
  }
};

//delete single bike by id
const deleteSingleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.productId;
    await ProductServices.deleteProductDB(id);
    res.status(200).json({
      success: true,
      message: 'Bike deleted successfully',
      result: {},
    });
  } catch (error) {
    res.status(500).json({
      message: 'Validation failed',
      success: false,
      error,
    });
  }
};

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
};
