import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
} from './order.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.customer),
  validateRequest(createOrderValidationSchema),
  OrderController.createOrder,
);
router.get(
  '/:id',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  OrderController.getSingleOrder,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  OrderController.getAllOrders,
);
router.patch(
  '/:id/status',
  auth(USER_ROLE.admin),
  validateRequest(updateOrderStatusValidationSchema),
  OrderController.updateOrderStatus,
);

router.delete('/:id', auth(USER_ROLE.admin), OrderController.deleteOrder);

// router.post(
//   '/:id/payment',
//   auth(USER_ROLE.customer),
//   OrderControllers.processPayment,
// );

export const OrderRoute = router;
