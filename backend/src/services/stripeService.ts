import Stripe from 'stripe';
import { PaymentError, ErrorCode } from '../utils/AppError';
import prisma from '../config/database';
import { PlanType } from '../generated/prisma';
// import { emailService } from './emailService'; // TODO: Re-enable when emailService is implemented

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export class StripeService {
  // Create a new customer in Stripe
  async createCustomer(email: string, name?: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          source: 'ytscript',
        },
      });
      return customer.id;
    } catch (error: any) {
      throw new PaymentError(
        'Failed to create customer',
        ErrorCode.STRIPE_ERROR,
        { originalError: error.message }
      );
    }
  }

  // Create checkout session for subscription
  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new PaymentError('User not found');
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        customerId = await this.createCustomer(user.email, user.name || undefined);
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
        },
        subscription_data: {
          trial_period_days: 7, // 7-day free trial
        },
      });

      return session.url || '';
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(
        'Failed to create checkout session',
        ErrorCode.STRIPE_ERROR,
        { originalError: error.message }
      );
    }
  }

  // Create customer portal session for subscription management
  async createPortalSession(userId: string, returnUrl: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.stripeCustomerId) {
        throw new PaymentError('No subscription found');
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(
        'Failed to create portal session',
        ErrorCode.STRIPE_ERROR,
        { originalError: error.message }
      );
    }
  }

  // Get subscription status
  async getSubscriptionStatus(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.subscriptionId) {
        return {
          status: 'inactive',
          plan: 'free',
        };
      }

      const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
      
      // Get payment method
      let paymentMethod = null;
      if (subscription.default_payment_method) {
        const pm = await stripe.paymentMethods.retrieve(
          subscription.default_payment_method as string
        );
        paymentMethod = {
          brand: pm.card?.brand,
          last4: pm.card?.last4,
        };
      }

      return {
        status: subscription.status,
        plan: user.plan,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        paymentMethod,
      };
    } catch (error: any) {
      throw new PaymentError(
        'Failed to get subscription status',
        ErrorCode.STRIPE_ERROR,
        { originalError: error.message }
      );
    }
  }

  // Handle webhook events
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private async handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) return;

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: PlanType.PRO,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
      },
    });

    // Send welcome email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      // TODO: Create welcome email method in emailService
      console.log(`Welcome email would be sent to ${user.email}`);
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date((subscription as any).current_period_end * 1000),
        plan: subscription.status === 'active' ? PlanType.PRO : PlanType.FREE,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: PlanType.FREE,
        subscriptionStatus: 'canceled',
        subscriptionId: null,
      },
    });

    // TODO: Send cancellation email
    console.log(`Cancellation email would be sent to ${user.email}`);
  }

  private async handlePaymentSuccess(invoice: Stripe.Invoice): Promise<void> {
    // Log payment success
    if (invoice.customer && (invoice as any).subscription) {
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: invoice.customer as string },
      });

      if (user) {
        await prisma.payment.create({
          data: {
            userId: user.id,
            stripePaymentId: (invoice as any).payment_intent as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            receiptUrl: invoice.hosted_invoice_url || undefined,
          },
        });

        // TODO: Send receipt email
        console.log(`Receipt email would be sent to ${user.email}`);
      }
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (invoice.customer) {
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: invoice.customer as string },
      });

      if (user) {
        // TODO: Send payment failed email
        console.log(`Payment failed email would be sent to ${user.email}`);
      }
    }
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.subscriptionId) {
        throw new PaymentError('No active subscription found');
      }

      // Cancel at period end
      await stripe.subscriptions.update(user.subscriptionId, {
        cancel_at_period_end: true,
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: 'canceling',
        },
      });
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(
        'Failed to cancel subscription',
        ErrorCode.STRIPE_ERROR,
        { originalError: error.message }
      );
    }
  }

}

export const stripeService = new StripeService();