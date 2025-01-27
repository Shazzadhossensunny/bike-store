import express from 'express';
import { ProductController } from './product.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import {
  productValidationSchema,
  updateProductValidationSchema,
} from './product.validation';

const router = express.Router();

router.get('/', ProductController.getAllProduct);
router.get('/:id', ProductController.getSingleProduct);
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(productValidationSchema),
  ProductController.createProduct,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateProductValidationSchema),
  ProductController.updateSingleProduct,
);

router.delete('/:id', auth(USER_ROLE.admin), ProductController.deleteProduct);

export const ProductRoute = router;
