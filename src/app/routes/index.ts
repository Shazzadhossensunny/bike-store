import { Router } from 'express';
import { ProductRoute } from '../modules/Product/product.route';
import { OrderRoute } from '../modules/Order/order.route';
import { UserRoute } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

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
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
