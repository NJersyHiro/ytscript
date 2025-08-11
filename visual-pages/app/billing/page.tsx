'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Crown,
  Video,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

interface BillingInfo {
  plan: 'free' | 'pro';
  nextBillingDate?: string;
  amount?: number;
  paymentMethod?: {
    type: 'card';
    last4: string;
    brand: string;
    expiry: string;
  };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

export default function BillingPage() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would fetch from Stripe/API
    const mockBilling: BillingInfo = {
      plan: 'free',
      // Uncomment for Pro user example:
      // plan: 'pro',
      // nextBillingDate: '2024-09-10',
      // amount: 20,
      // paymentMethod: {
      //   type: 'card',
      //   last4: '4242',
      //   brand: 'Visa',
      //   expiry: '12/25'
      // }
    };

    const mockInvoices: Invoice[] = [
      // Uncomment for invoice history example:
      // {
      //   id: 'inv_1234',
      //   date: '2024-08-10',
      //   amount: 20,
      //   status: 'paid',
      //   description: 'YTScript Pro - Monthly Subscription',
      //   downloadUrl: '/api/invoices/inv_1234/download'
      // }
    ];

    setTimeout(() => {
      setBillingInfo(mockBilling);
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center gap-2 p-6 border-b dark:border-gray-700">
          <Video className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold">YTScript</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <CreditCard className="w-5 h-5" />
                Billing
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing & Subscription</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your subscription and billing information</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-6">Current Plan</h3>
              
              {billingInfo?.plan === 'free' ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Free Plan</h4>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                        Current
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Unlimited single video extractions with basic export formats
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">$0</div>
                    <div className="text-gray-500 dark:text-gray-400">per month</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="w-6 h-6 text-yellow-500" />
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pro Plan</h4>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Unlimited processing, AI summaries, batch operations, and premium exports
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ${billingInfo?.amount}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">per month</div>
                  </div>
                </div>
              )}

              {/* Next Billing / Upgrade */}
              <div className="flex items-center justify-between pt-6 border-t dark:border-gray-700">
                {billingInfo?.plan === 'pro' ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Next billing: {billingInfo.nextBillingDate && formatDate(billingInfo.nextBillingDate)}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Upgrade for unlimited features and AI summaries
                  </div>
                )}
                
                <div className="flex gap-3">
                  {billingInfo?.plan === 'free' ? (
                    <button className="btn-gradient">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro
                    </button>
                  ) : (
                    <>
                      <button className="btn-ghost text-sm">
                        Cancel Subscription
                      </button>
                      <button className="btn-primary">
                        Manage Subscription
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {billingInfo?.plan === 'pro' && billingInfo.paymentMethod && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Payment Method</h3>
                  <button className="btn-ghost text-sm">Update</button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {billingInfo.paymentMethod.brand} •••• {billingInfo.paymentMethod.last4}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Expires {billingInfo.paymentMethod.expiry}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <h3 className="text-xl font-semibold">Invoice History</h3>
              </div>
              
              <div className="p-6">
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No invoices yet
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {billingInfo?.plan === 'free' 
                        ? 'Upgrade to Pro to see your billing history here.'
                        : 'Your invoices will appear here after billing.'}
                    </p>
                    {billingInfo?.plan === 'free' && (
                      <button className="btn-primary mt-4">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(invoice.status)}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {invoice.description}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(invoice.date)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              ${invoice.amount.toFixed(2)}
                            </div>
                          </div>
                          {invoice.downloadUrl && (
                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upgrade CTA for Free Users */}
            {billingInfo?.plan === 'free' && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Upgrade to YTScript Pro</h3>
                  <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                    Unlock AI summaries, batch processing, advanced exports, cloud storage, and priority support.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">Unlimited</div>
                      <div className="text-blue-100 text-sm">Batch Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">AI-Powered</div>
                      <div className="text-blue-100 text-sm">GPT-4 Summaries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">90-Day</div>
                      <div className="text-blue-100 text-sm">Cloud Storage</div>
                    </div>
                  </div>
                  
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
                    Start Pro Trial - $20/month
                  </button>
                  <p className="text-blue-100 text-sm mt-2">30-day money-back guarantee</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}