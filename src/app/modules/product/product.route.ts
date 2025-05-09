import express from 'express';
import { ProductController } from './product.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
  createProductValidationSchema,
  updateProductValidationSchema,
} from './product.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(createProductValidationSchema),
  ProductController.createProduct,
);
router.get('/categories', ProductController.getCategories);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateProductValidationSchema),
  ProductController.updateSingleProduct,
);

router.delete('/:id', auth(USER_ROLE.admin), ProductController.deleteProduct);
router.get('/', ProductController.getAllProducts);

export const ProductRoute = router;
