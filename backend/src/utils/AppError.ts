export enum ErrorCode {
  // Authentication & Authorization
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_NO_TOKEN = 'AUTH_NO_TOKEN',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  AUTH_INSUFFICIENT_PLAN = 'AUTH_INSUFFICIENT_PLAN',
  AUTH_EMAIL_NOT_VERIFIED = 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  
  // Validation
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED = 'MISSING_REQUIRED',
  INVALID_URL = 'INVALID_URL',
  
  // Resource
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  VIDEO_NOT_FOUND = 'VIDEO_NOT_FOUND',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server Errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  
  // Extraction specific
  EXTRACTION_FAILED = 'EXTRACTION_FAILED',
  VIDEO_PRIVATE = 'VIDEO_PRIVATE',
  TRANSCRIPT_UNAVAILABLE = 'TRANSCRIPT_UNAVAILABLE',
  
  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  STRIPE_ERROR = 'STRIPE_ERROR',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;
    
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, ErrorCode.VALIDATION_FAILED, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.AUTH_INVALID_TOKEN) {
    super(message, 401, errorCode);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.AUTH_FORBIDDEN) {
    super(message, 403, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.RESOURCE_NOT_FOUND) {
    super(message, 404, errorCode);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', details?: any) {
    super(message, 429, ErrorCode.RATE_LIMIT_EXCEEDED, details);
  }
}

export class ExtractionError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.EXTRACTION_FAILED, details?: any) {
    super(message, 500, errorCode, details);
  }
}

export class PaymentError extends AppError {
  constructor(message: string, errorCode: ErrorCode = ErrorCode.PAYMENT_FAILED, details?: any) {
    super(message, 402, errorCode, details);
  }
}