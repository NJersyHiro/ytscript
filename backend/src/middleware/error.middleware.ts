import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../utils/AppError';

// Re-export AppError for backward compatibility
export { AppError } from '../utils/AppError';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
    method?: string;
    stack?: string;
  };
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR;
  let details: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.errorCode;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    // Prisma validation errors
    statusCode = 400;
    message = 'Validation error';
    errorCode = ErrorCode.VALIDATION_FAILED;
    details = err.message;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
    errorCode = ErrorCode.AUTH_SESSION_EXPIRED;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errorCode = ErrorCode.AUTH_INVALID_TOKEN;
  } else if (err.message) {
    message = err.message;
  }

  // Log error for debugging (but not in test environment)
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', {
      code: errorCode,
      message: err.message,
      statusCode,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Add rate limit headers if applicable
  if (statusCode === 429) {
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 900000).toISOString()); // 15 minutes from now
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper utility
export const asyncHandler = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
  return ((req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }) as T;
};