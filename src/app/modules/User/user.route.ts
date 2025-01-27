import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post('/', UserControllers.registerUser);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.getUserById,
);
router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.updateUserById,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.deleteUserById,
);

export const UserRoute = router;
