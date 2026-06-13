import { Request, Response, NextFunction } from "express";
import { config } from "@/config/index";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
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
};

// Global error handler middleware
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(config.isDevelopment && { details: err.details }),
      timestamp: new Date().toISOString(),
    });
  }

  // Unexpected error
  console.error("Unexpected error:", err);

  res.status(500).json({
    success: false,
    error: config.isDevelopment ? err.message : "Internal server error",
    code: "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
  });
}

// Async handler wrapper to catch errors in async route handlers
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
