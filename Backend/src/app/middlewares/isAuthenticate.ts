import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/CatchAsyncError";

const ErrorHandler = require("../utiles/ErrorHandler");
const { jwtVerify } = require("../utiles/jwtVerify");

interface AuthenticatedRequest extends Request {
  id?: string;
  role?: string;
}

exports.isAuthenticated = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies ? req.cookies["authenticate-token"] : null;

    if (!token) {
      return next(new ErrorHandler("Login to access", 401));
    }

    try {
      const decoded = await jwtVerify(token);
      if (!decoded) {
        return next(new ErrorHandler("Failed to load user", 401));
      }
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    } catch (error) {
      return next(new ErrorHandler("Token verification failed", 401));
    }
  },
);
