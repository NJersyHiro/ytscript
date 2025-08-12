'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, CheckIcon, XIcon } from 'lucide-react';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signup');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/subscription/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          priceId: 'price_1RufpyCDcGvZEJBmQ0xhAk6h', // Monthly price ID from Stripe
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();
      console.log('Checkout response:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to create checkout session');
      }
      
      // Backend returns { success: true, data: { checkoutUrl } }
      if (data.data?.checkoutUrl) {
        console.log('Redirecting to:', data.data.checkoutUrl);
        window.location.href = data.data.checkoutUrl;
      } else if (data.checkoutUrl) {
        // Fallback for direct checkoutUrl
        console.log('Redirecting to:', data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert(error instanceof Error ? error.message : 'Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📹</span>
              <span className="text-xl font-bold text-white">YTScript</span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, <span className="gradient-text">transparent pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start for free, upgrade when you need more power. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="glass-card p-8 rounded-2xl border border-gray-800">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white">Free</h3>
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400">Perfect for individual creators</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Unlimited single video extraction</div>
                  <div className="text-sm text-gray-400">Process as many individual videos as you want</div>
                </div>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">TXT & SRT export</div>
                  <div className="text-sm text-gray-400">Download transcripts in basic formats</div>
                </div>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">No registration required</div>
                  <div className="text-sm text-gray-400">Start using immediately</div>
                </div>
              </li>
              <li className="flex items-start opacity-50">
                <XIcon className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-gray-500">Channel & playlist processing</div>
              </li>
              <li className="flex items-start opacity-50">
                <XIcon className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-gray-500">AI summaries</div>
              </li>
            </ul>

            <button disabled className="w-full py-3 px-4 bg-gray-800 text-gray-400 rounded-lg font-medium cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25"></div>
            <div className="relative glass-card p-8 rounded-2xl border border-purple-500/50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  BEST VALUE
                </span>
              </div>
              
              <div className="mb-8 mt-4">
                <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">$20</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-400">For serious content creators</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Everything in Free</div>
                    <div className="text-sm text-gray-400">All free features included</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Unlimited channel & playlist processing</div>
                    <div className="text-sm text-gray-400">Batch process entire channels</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">AI-powered summaries (GPT-4)</div>
                    <div className="text-sm text-gray-400">Get intelligent video summaries</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">PDF, Word, Excel exports</div>
                    <div className="text-sm text-gray-400">Professional format exports</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">90-day cloud storage</div>
                    <div className="text-sm text-gray-400">Access your transcripts anywhere</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Priority processing</div>
                    <div className="text-sm text-gray-400">Skip the queue</div>
                  </div>
                </li>
              </ul>

              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro'}
                {!loading && <ArrowRightIcon className="w-4 h-4 ml-2" />}
              </button>
              
              <p className="text-center text-sm text-gray-400 mt-4">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-gray-400">
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-green-500" />
            <span>30-day money-back guarantee</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-green-500" />
            <span>Cancel anytime</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <CheckIcon className="w-5 h-5 text-green-500" />
            <span>No hidden fees</span>
          </div>
        </div>
      </div>
    </div>
  );
}