import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post(
  '/register',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 8 },
    name: { required: false, type: 'string', maxLength: 100 },
  }),
  authController.register
);

router.post(
  '/login',
  validate({
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' },
  }),
  authController.login
);

router.post('/logout', authController.logout);

router.post(
  '/refresh',
  validate({
    refreshToken: { required: true, type: 'string' },
  }),
  authController.refreshAccessToken
);

router.post(
  '/forgot-password',
  validate({
    email: { required: true, type: 'email' },
  }),
  authController.forgotPassword
);

router.post(
  '/reset-password/:token',
  validate({
    password: { required: true, type: 'string', minLength: 8 },
  }),
  authController.resetPassword
);

router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes
router.get('/me', authenticate, authController.getMe);

export default router;