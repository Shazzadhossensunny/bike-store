import { Router } from 'express';
import { ProductRoute } from '../modules/product/product.route';
import { OrderRoute } from '../modules/order/order.route';
import { UserRoute } from '../modules/User/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/products',
    route: ProductRoute,
  },
  {
    path: '/orders',
    route: OrderRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
