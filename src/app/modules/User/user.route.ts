import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post('/', UserControllers.registerUser);
router.get('/:id', UserControllers.getUserById);
router.put('/:id', UserControllers.updateUserById);
router.delete('/:id', UserControllers.deleteUserById);

export const UserRoute = router;
