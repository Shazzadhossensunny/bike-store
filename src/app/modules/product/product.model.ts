import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';
import { boolean } from 'zod';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
  },
  {
    timestamps: true,
  },
);

//create a model
export const Product = model<TProduct>('Product', productSchema);
