import { Response } from 'express';

interface TResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
};

interface TResponseWithToken<T> extends TResponse<T>{
  token:string
}


const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode:data.statusCode,
    message: data.message,
    data: data.data,
  });
};

export const sendResponseWithToken = <T>(res: Response, data: TResponseWithToken<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode:data.statusCode,
    message: data.message,
    data: data.data,
    token:data.token
  });
};

export default sendResponse;
