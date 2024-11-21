import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    minlength: [2, 'Brand name must be at least 2 characters long'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
  },
  category: {
    type: String,
    enum: {
      values: ['Mountain', 'Road', 'Hybrid', 'Electric'],
      message:
        '{VALUE} is not in Category.Category must be one of Mountain, Road, Hybrid, or Electric',
    },
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer',
    },
  },
  inStock: {
    type: Boolean,
    required: [true, 'In-stock status is required'],
    default: true,
  },
});

//create a model
export const ProductModel = model<TProduct>('Product', productSchema);
