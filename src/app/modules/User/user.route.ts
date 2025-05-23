import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post('/register', UserControllers.registerUser);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.getUserById,
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  validateRequest(UserValidation.changePasswordValidation),
  UserControllers.changePassword,
);
router.patch(
  '/toggle-status/:id',
  auth(USER_ROLE.admin),
  UserControllers.toggleUserStatus,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.deleteUserById,
);

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUser);

export const UserRoute = router;
