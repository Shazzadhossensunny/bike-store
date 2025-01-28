import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  passwordChangedAt?: Date;
}

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
