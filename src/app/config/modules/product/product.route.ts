import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();
//call controller func

router.post('/products', ProductController.createProduct);
router.get('/products/:productId', ProductController.getSingleProduct);
router.put('/products/:productId', ProductController.updateSingleProduct);
router.delete('/products/:productId', ProductController.deleteSingleProduct);
router.get('/products', ProductController.getAllProduct);

export const ProductRoute = router;
