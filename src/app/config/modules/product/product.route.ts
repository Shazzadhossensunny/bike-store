import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();
//call controller func

router.post('/products', ProductController.createProduct);

export const ProductRoute = router;
