import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';
import {
  hashPassword,
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  verifyToken,
} from '../utils/auth.utils';
import { PlanType } from '../generated/prisma';
import { emailService } from '../services/emailService';
import { tokenUtils } from '../utils/tokenUtils';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create verification token
    const emailVerificationToken = generateEmailVerificationToken();
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerificationToken,
        plan: PlanType.FREE,
      },
    });
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);
    
    // Update user with refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    
    // Send verification email
    try {
      await emailService.sendEmailVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    
    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);
    
    // Update user with refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLogin: new Date(),
      },
    });
    
    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Delete session
      await prisma.session.deleteMany({
        where: { token },
      });
    }
    
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }
    
    // Verify refresh token
    const payload = verifyToken(refreshToken);
    
    // Find user with this refresh token
    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        refreshToken,
      },
    });
    
    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user.id);
    
    // Update refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });
    
    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new AppError('Refresh token expired', 401));
    }
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        isEmailVerified: true,
        monthlyUsage: true,
        totalUsage: true,
        createdAt: true,
        lastLogin: true,
      },
    });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });
    
    if (!user) {
      throw new AppError('Invalid verification token', 400);
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });
    
    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Don't reveal if email exists
      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      });
      return;
    }
    
    const resetToken = tokenUtils.generatePasswordResetToken(user.id, user.email);
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });
    
    // Send reset password email
    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Still return success to avoid email enumeration
    }
    
    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Don't reveal if email exists
      res.json({
        success: true,
        message: 'If the email exists and is not verified, a verification email has been sent',
      });
      return;
    }
    
    if (user.isEmailVerified) {
      res.json({
        success: true,
        message: 'Email is already verified',
      });
      return;
    }
    
    // Generate new verification token
    const emailVerificationToken = tokenUtils.generateEmailVerificationToken(user.id, user.email);
    
    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken },
    });
    
    // Send verification email
    try {
      await emailService.sendEmailVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }
    
    res.json({
      success: true,
      message: 'If the email exists and is not verified, a verification email has been sent',
    });
  } catch (error) {
    next(error);
  }
};

export const validateResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    
    // First, try to verify the JWT token
    const decoded = tokenUtils.verifyToken(token);
    
    if (!decoded || decoded.type !== 'passwordReset') {
      throw new AppError('Invalid reset token', 400);
    }
    
    // Check if token exists in database and is not expired
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });
    
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new AppError('Reset token has expired', 400));
    }
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });
    
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    
    const hashedPassword = await hashPassword(password);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    
    // Send password reset success email
    try {
      await emailService.sendPasswordResetSuccessEmail(user.email);
    } catch (emailError) {
      console.error('Failed to send password reset success email:', emailError);
      // Don't fail the reset if email fails
    }
    
    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};