import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static methods
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
//   passwordChangedTimestamp: Date,
//   jwtIssuedTimestamp: number,
// ) {
//   const passwordChangedTime =
//     new Date(passwordChangedTimestamp).getTime() / 1000;
//   return passwordChangedTime > jwtIssuedTimestamp;
// };

export const User = model<TUser, UserModel>('User', userSchema);
