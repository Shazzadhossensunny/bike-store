export type TProduct = {
  name: string;
  brand: string;
  price: number;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric';
  description: string;
  quantity: number;
  inStock: boolean;
};
