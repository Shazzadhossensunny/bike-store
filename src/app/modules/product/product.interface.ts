import { Types } from 'mongoose';

export type TProduct = {
  _id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description: string;
  createdBy: Types.ObjectId;
};
