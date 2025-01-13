import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/CatchAsyncError";
import { UNAUTHORIZED } from "../utils/Http-Status";

import ErrorHandler from "../utils/ErrorHandler";
import { jwtVerify } from "../utils/jwtVerify";

interface AuthenticatedRequest extends Request {
  id?: string;
  role?: string;
}

export interface AuthenticateRequest extends Request {
  id?: string;
}

export const isAuthenticate = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies ? req.cookies["authenticate-token"] : null;

    if (!token) {
      return next(new ErrorHandler("Login to access", UNAUTHORIZED));
    }

    try {
      const decoded = await jwtVerify(token);
      if (!decoded) {
        return next(new ErrorHandler("Failed to load user", UNAUTHORIZED));
      }
      if (typeof decoded !== 'string' && 'id' in decoded) {
        req.id = decoded.id;
      } else {
        return next(new ErrorHandler("Invalid token payload", UNAUTHORIZED));
      }
      next();
    } catch (error) {
      return next(new ErrorHandler("Token verification failed", UNAUTHORIZED));
    }
  },
);
