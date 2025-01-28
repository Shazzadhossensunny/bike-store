import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { StatusCodes } from 'http-status-codes';

const registerUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await UserServices.findUserById(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User get successfully',
    data: user,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await UserServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});

// const updateUserById = catchAsync(async (req, res) => {
//   const updateUser = await UserServices.updateUser(req.params.id, req.body);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'User update successfully',
//     data: updateUser,
//   });
// });
const deleteUserById = catchAsync(async (req, res) => {
  const deleteUser = await UserServices.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User delete successfully',
    data: deleteUser,
  });
});

export const UserControllers = {
  registerUser,
  getUserById,
  changePassword,
  // updateUserById,
  deleteUserById,
};
