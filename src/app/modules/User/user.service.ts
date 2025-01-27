import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { StatusCodes } from 'http-status-codes';

const createUser = async (userData: TUser) => {
  const user = new User(userData);
  return await user.save();
};

const findUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  return user;
};

const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

const updateUser = async (id: string, updateData: Partial<TUser>) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true });
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  return user;
};

const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const UserServices = {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
};
