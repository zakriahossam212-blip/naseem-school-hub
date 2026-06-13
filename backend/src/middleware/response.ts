import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "@/types/index";

declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, statusCode?: number): void;
      error(message: string, statusCode?: number): void;
    }
  }
}

export function responseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = function <T>(data: T, statusCode = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
  };

  res.error = function (message: string, statusCode = 400) {
    const response: ApiResponse<null> = {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
  };

  next();
}
