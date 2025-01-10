import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import ErrorHandler from '../utils/ErrorHandler'; 
import config from '../config/config';

// Handle Zod errors
const handleZodError = (err: ZodError) => {
  return {
    statusCode: 400,
    message: 'Validation failed',
    errorSources: err.errors.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  };
};

// Handle MySQL2 errors
const handleMysqlError = (err: Error & { code: string; sqlState: string }) => {
  return {
    statusCode: 500,
    message: 'Database error',
    errorSources: [
      {
        path: err.sqlState || '',
        message: err.message,
      },
    ],
  };
};

// Handle Duplicate Key Errors (e.g., MongoDB or MySQL)
const handleDuplicateKeyError = (err: any) => {
  return {
    statusCode: 409, // Conflict error
    message: 'Duplicate key error',
    errorSources: [
      {
        path: err.keyValue ? Object.keys(err.keyValue).join(', ') : '',
        message: `Duplicate value found for: ${err.keyValue}`,
      },
    ],
  };
};

// Handle Custom Application Errors
const handleAppError = (err: ErrorHandler) => {
  return {
    statusCode: err.statusCode || 400,
    message: err.message || 'Application error occurred',
    errorSources: [
      {
        path: '',
        message: err.message,
      },
    ],
  };
};

const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Default error response values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorSources = [
    {
      path: '',
      message: '',
    },
  ];

  // Zod error handling
  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errorSources = zodError.errorSources;
  }
  // MySQL2 error handling
  else if (err && err.code && err.sqlState) {
    const mysqlError = handleMysqlError(err);
    statusCode = mysqlError.statusCode;
    message = mysqlError.message;
    errorSources = mysqlError.errorSources;
  }
  // Duplicate Key Error handling
  else if (err.code === 11000 || err.code === 'ER_DUP_ENTRY') {
    const duplicateKeyError = handleDuplicateKeyError(err);
    statusCode = duplicateKeyError.statusCode;
    message = duplicateKeyError.message;
    errorSources = duplicateKeyError.errorSources;
  }
  // Custom Application Error handling
  else if (err instanceof ErrorHandler) {
    const appError = handleAppError(err);
    statusCode = appError.statusCode;
    message = appError.message;
    errorSources = appError.errorSources;
  }

  // Ensure err is an instance of ErrorHandler
  if (!(err instanceof ErrorHandler)) {
    err = new ErrorHandler(message, statusCode);
  }

  // Send the error response to the client
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err.stack : undefined,
  });
  return next();
};

export default globalErrorHandler;
