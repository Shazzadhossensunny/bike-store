import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();
//call controller func

router.post('/', ProductController.createProduct);
router.get('/:productId', ProductController.getSingleProduct);
router.put('/:productId', ProductController.updateSingleProduct);
router.delete('/:productId', ProductController.deleteSingleProduct);
router.get('/', ProductController.getAllProduct);

export const ProductRoute = router;
