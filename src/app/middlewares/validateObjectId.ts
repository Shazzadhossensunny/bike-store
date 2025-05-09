import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../utils/sendResponse';

// Middleware to validate MongoDB ObjectId
const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    // Skip validation for special routes
    if (id === 'my-orders') {
      return next();
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: `Invalid ${paramName} format`,
        data: null,
      });
    }
    next();
  };
};

export default validateObjectId;
