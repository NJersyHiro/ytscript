'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import useStripe from '@/hooks/useStripe';
import { 
  CheckCircle, 
  X, 
 
  ArrowRight, 
  Star,
  Clock,
  Shield,
  Zap,
  Users,
  Video,
  AlertCircle
} from 'lucide-react';

export default function PricingPage() {
  const { user } = useAuth();
  const { createCheckoutSession, loading, error } = useStripe();
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'cancelled' | null>(null);

  // Check for checkout status in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('checkout');
    if (status === 'success' || status === 'cancelled') {
      setCheckoutStatus(status as 'success' | 'cancelled');
    }
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      // Redirect to signup if not logged in
      window.location.href = '/signup';
      return;
    }

    try {
      await createCheckoutSession({
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
        trialDays: 7
      });
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">YTScript</h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Dashboard
            </Link>
            {!user && (
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Checkout Status Messages */}
        {checkoutStatus === 'success' && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Payment Successful!</h3>
                <p className="text-green-700 dark:text-green-300">Welcome to YTScript Pro! Your trial has started.</p>
              </div>
            </div>
          </div>
        )}

        {checkoutStatus === 'cancelled' && (
          <div className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Checkout Cancelled</h3>
                <p className="text-yellow-700 dark:text-yellow-300">No worries! You can upgrade anytime.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Payment Error</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header Content */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Simple, <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Start for free, upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Free</h3>
                  <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    Most Popular
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">$0</div>
                  <div className="text-gray-500 dark:text-gray-400">/month</div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for individual creators</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Unlimited single video extraction</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Process as many individual videos as you want</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">TXT format export</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Download transcripts in basic text format</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">No registration required</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Start using immediately</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400 dark:text-gray-500">Channel & playlist processing</div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-400 dark:text-gray-500">AI summaries</div>
                </li>
              </ul>
              
              <Link href="/signup" className="btn-secondary w-full">
                Current Plan
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                BEST VALUE
              </div>
            </div>
            <div className="absolute -inset-px bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pro</h3>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">$20</div>
                  <div className="text-gray-500 dark:text-gray-400">/month</div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">For serious content creators</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Everything in Free</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">All free features included</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Unlimited channel & playlist processing</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Batch process entire channels</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">AI-powered summaries (GPT-4)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Get intelligent video summaries</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">PDF, Word, Excel exports</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Professional format exports</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">90-day cloud storage</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Access your transcripts anywhere</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Priority processing</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Skip the queue</div>
                  </div>
                </li>
              </ul>
              
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className={`btn-gradient w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Upgrade to Pro
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                7-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-12">
            Trusted by 10,000+ creators worldwide
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Secure & Private</h4>
              <p className="text-gray-600 dark:text-gray-400">Your data is encrypted and never shared</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Lightning Fast</h4>
              <p className="text-gray-600 dark:text-gray-400">Process videos in under 10 seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">24/7 Support</h4>
              <p className="text-gray-600 dark:text-gray-400">Get help whenever you need it</p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>No hidden fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}