import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post('/', UserControllers.registerUser);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.getUserById,
);
// router.put(
//   '/:id',
//   auth(USER_ROLE.admin, USER_ROLE.customer),
//   UserControllers.updateUserById,
// );

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  validateRequest(UserValidation.changePasswordValidation),
  UserControllers.changePassword,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserControllers.deleteUserById,
);

export const UserRoute = router;
