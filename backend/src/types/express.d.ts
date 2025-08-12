declare namespace Express {
  interface Request {
    rateLimit?: {
      limit: number;
      remaining: number;
      resetTime: string;
    };
  }
}