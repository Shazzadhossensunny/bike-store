import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { TChangePassword, TUser } from './user.interface';
import { User } from './user.model';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import bcrypt from 'bcrypt';

const createUser = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const findUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
  }
  return user;
};

const findUserByEmail = async (email: string) => {
  const result = await User.findOne({ email });
  return result;
};

const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const user = await User.isUserExistsByEmail(userData.email);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    },
  );
  return null;
};

// const updateUser = async (id: string, updateData: Partial<TUser>) => {
//   const user = await User.findByIdAndUpdate(id, updateData, { new: true });
//   if (!user) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'User not found');
//   }
//   return user;
// };

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  createUser,
  findUserById,
  findUserByEmail,
  changePassword,
  // updateUser,
  deleteUser,
};
