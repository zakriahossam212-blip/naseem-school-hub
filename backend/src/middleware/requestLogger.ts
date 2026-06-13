import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';

/**
 * Middleware to add request logging and request ID tracking
 */
export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Add unique request ID
  const requestId = uuidv4();
  (req as any).requestId = requestId;

  // Record start time
  const startTime = Date.now();

  // Log incoming request
  logger.logRequest(req.method, req.path, (req as any).userId, {
    requestId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Intercept response
  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log response
    logger.logResponse(req.method, req.path, statusCode, duration, {
      requestId,
    });

    return originalSend.call(this, data);
  };

  next();
}
