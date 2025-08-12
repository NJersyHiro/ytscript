import { Request, Response, NextFunction } from 'express';
import { stripeService } from '../services/stripeService';
import { asyncHandler } from '../middleware/error.middleware';
import { ValidationError, AuthorizationError } from '../utils/AppError';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export const createCheckoutSession = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required');
  }

  const { priceId, successUrl, cancelUrl } = req.body;

  if (!priceId || !successUrl || !cancelUrl) {
    throw new ValidationError('Missing required fields');
  }

  const checkoutUrl = await stripeService.createCheckoutSession(
    req.user.userId,
    priceId,
    successUrl,
    cancelUrl
  );

  res.json({
    success: true,
    data: { checkoutUrl },
  });
});

export const createPortalSession = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required');
  }

  const { returnUrl } = req.body;

  if (!returnUrl) {
    throw new ValidationError('Return URL is required');
  }

  const portalUrl = await stripeService.createPortalSession(
    req.user.userId,
    returnUrl
  );

  res.json({
    success: true,
    data: { portalUrl },
  });
});

export const getSubscriptionStatus = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required');
  }

  const status = await stripeService.getSubscriptionStatus(req.user.userId);

  res.json({
    success: true,
    data: status,
  });
});

export const cancelSubscription = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required');
  }

  await stripeService.cancelSubscription(req.user.userId);

  res.json({
    success: true,
    message: 'Subscription will be canceled at the end of the billing period',
  });
});

export const handleWebhook = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    throw new ValidationError('No signature provided');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await stripeService.handleWebhook(event);

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    throw new ValidationError('Invalid signature');
  }
});

