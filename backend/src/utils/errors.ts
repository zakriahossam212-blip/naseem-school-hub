import { Request, Response, NextFunction } from "express";
import { config } from "@/config/index";
import { logger } from "./logger";

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  timestamp: string;
  path?: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON(): ErrorResponse {
    return {
      success: false,
      error: this.message,
      code: this.code,
      timestamp: new Date().toISOString(),
      ...(config.isDevelopment && { details: this.details }),
    };
  }
}

// Common error constructors
export const errors = {
  // 400 Bad Request
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new AppError(400, message, "BAD_REQUEST", details),

  // 401 Unauthorized
  unauthorized: (message: string = "Unauthorized") =>
    new AppError(401, message, "UNAUTHORIZED"),

  // 403 Forbidden
  forbidden: (message: string = "Forbidden") =>
    new AppError(403, message, "FORBIDDEN"),

  // 404 Not Found
  notFound: (message: string = "Not found") =>
    new AppError(404, message, "NOT_FOUND"),

  // 409 Conflict
  conflict: (message: string = "Resource already exists") =>
    new AppError(409, message, "CONFLICT"),

  // 422 Unprocessable Entity
  unprocessable: (message: string, details?: Record<string, unknown>) =>
    new AppError(422, message, "UNPROCESSABLE_ENTITY", details),

  // 500 Internal Server Error
  internalError: (message: string = "Internal server error") =>
    new AppError(500, message, "INTERNAL_ERROR"),

  // Database error
  databaseError: (message: string = "Database operation failed") =>
    new AppError(500, message, "DATABASE_ERROR"),

  // Authentication error
  authenticationError: (message: string = "Authentication failed") =>
    new AppError(401, message, "AUTHENTICATION_ERROR"),
};

// Global error handler middleware
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  const requestId = (req as any).requestId;
  const path = req.path;

  if (err instanceof AppError) {
    // Log operational error
    logger.warn(`Error: ${err.message}`, {
      statusCode: err.statusCode,
      code: err.code,
      path,
      requestId,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      timestamp: new Date().toISOString(),
      path,
      requestId,
      ...(config.isDevelopment && { details: err.details }),
    });
  }

  // Unexpected error
  logger.error('Unexpected error occurred', err as Error, {
    path,
    requestId,
  });

  return res.status(500).json({
    success: false,
    error: config.isDevelopment ? (err as Error).message : "Internal server error",
    code: "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
    path,
    requestId,
  });
}

// Async handler wrapper to catch errors in async route handlers
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Log async error
      logger.error("Async handler error", err as Error, {
        path: req.path,
        requestId: (req as any).requestId,
      });
      next(err);
    });
  };
}
