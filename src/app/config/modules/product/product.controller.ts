import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import productValidationSchema from './product.validation';

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

export const ProductController = {
  createProduct,
};
