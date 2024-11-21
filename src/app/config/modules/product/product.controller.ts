import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import productValidationSchema from './product.validation';

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const zodParseValidation = productValidationSchema.parse(productData);
    const result =
      await ProductServices.createProductIntoDB(zodParseValidation);
    res.status(200).json({
      success: true,
      message: 'Bike created successfully!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong!',
      error: err,
    });
  }
};

export const ProductController = {
  createProduct,
};
