import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/auth.utils';
import { AppError } from './error.middleware';
import prisma from '../config/database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First try OAuth session cookie authentication
    const userCookie = req.cookies?.user;
    if (userCookie) {
      try {
        const oauthUser = JSON.parse(userCookie);
        if (oauthUser && oauthUser.id && oauthUser.email) {
          // Find or create OAuth user in database
          let user = await prisma.user.findUnique({
            where: { email: oauthUser.email },
          });
          
          if (!user) {
            // Create new OAuth user if they don't exist
            user = await prisma.user.create({
              data: {
                id: oauthUser.id,
                email: oauthUser.email,
                name: oauthUser.name || null,
                password: 'oauth-user', // OAuth users don't have passwords
                isEmailVerified: true, // OAuth emails are pre-verified
                plan: 'FREE',
              },
            });
          }
          
          // Set user in request for OAuth users
          req.user = {
            userId: user.id,
            email: user.email,
            plan: user.plan,
          };
          return next();
        }
      } catch (error) {
        // Continue to JWT authentication if OAuth parsing fails
        console.warn('OAuth cookie parsing failed:', error);
      }
    }
    
    // Fall back to JWT token authentication
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    
    const token = authHeader.substring(7);
    
    try {
      const payload = verifyToken(token);
      
      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      
      if (!user) {
        throw new AppError('User not found', 401);
      }
      
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AppError('Token expired', 401);
      }
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};

// Optional authentication - sets req.user if token/cookie exists but doesn't require it
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First try OAuth session cookie authentication
    const userCookie = req.cookies?.user;
    if (userCookie) {
      try {
        const oauthUser = JSON.parse(userCookie);
        if (oauthUser && oauthUser.id && oauthUser.email) {
          // Find or create OAuth user in database
          let user = await prisma.user.findUnique({
            where: { email: oauthUser.email },
          });
          
          if (!user) {
            // Create new OAuth user if they don't exist
            user = await prisma.user.create({
              data: {
                id: oauthUser.id,
                email: oauthUser.email,
                name: oauthUser.name || null,
                password: 'oauth-user', // OAuth users don't have passwords
                isEmailVerified: true, // OAuth emails are pre-verified
                plan: 'FREE',
              },
            });
          }
          
          // Set user in request for OAuth users
          req.user = {
            userId: user.id,
            email: user.email,
            plan: user.plan,
          };
          
          return next();
        }
      } catch (err) {
        // Invalid cookie, continue without auth
        console.log('Invalid OAuth cookie:', err);
      }
    }
    
    // Then try JWT token authentication
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (token) {
      try {
        const payload = verifyToken(token);
        
        // Verify user still exists
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
            plan: true,
          },
        });
        
        if (user) {
          req.user = payload;
        }
      } catch (error) {
        // Invalid token, continue without auth
        console.log('Invalid JWT token:', error);
      }
    }
    
    // Continue regardless of authentication status
    next();
  } catch (error) {
    // Any errors in optional auth should not block the request
    console.error('Error in optional auth:', error);
    next();
  }
};

export const requirePlan = (allowedPlans: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    if (!allowedPlans.includes(req.user.plan)) {
      return next(new AppError('Insufficient plan privileges', 403));
    }
    
    next();
  };
};