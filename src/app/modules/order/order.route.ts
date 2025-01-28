import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import {
  createOrderValidationSchema,
  updateOrderValidationSchema,
} from './order.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.customer),
  validateRequest(createOrderValidationSchema),
  OrderController.createOrder,
);

router.get(
  '/my-orders',
  auth(USER_ROLE.customer),
  OrderController.getUserOrders,
);

router.get('/', auth(USER_ROLE.admin), OrderController.getAllOrders);
router.patch(
  '/:id/status',
  auth(USER_ROLE.admin),
  validateRequest(updateOrderValidationSchema),
  OrderController.updateOrderStatus,
);
router.get(
  '/:id',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  OrderController.getSingleOrder,
);

router.delete('/:id', auth(USER_ROLE.admin), OrderController.deleteOrder);

export const OrderRoute = router;
