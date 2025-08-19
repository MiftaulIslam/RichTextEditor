import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import ErrorHandler from '../utils/ErrorHandler';

const validateRequests = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validation check
      //if everything allright next() ->
      await schema.parseAsync({
        body: req.body,
      });

      next();
    } catch (err) {
      next(new ErrorHandler(`Validation Error: ${err}`, 400));
    }
  };
};

export default validateRequests;
