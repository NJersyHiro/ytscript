import { Router } from 'express';
import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  cancelSubscription,
  handleWebhook,
} from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';
import express from 'express';

const router = Router();

// Subscription management endpoints - require authentication
router.post('/create-checkout-session', authenticate, createCheckoutSession);
router.post('/create-portal-session', authenticate, createPortalSession);
router.get('/status', authenticate, getSubscriptionStatus);
router.post('/cancel', authenticate, cancelSubscription);

// Webhook endpoint - raw body required for signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

export default router;