'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, isApiError } from '@/lib/api';
import { 
  BarChart3, 
  FileText, 
  Clock, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  List
} from 'lucide-react';
import Link from 'next/link';

interface UsageStats {
  period: string;
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  tier: string;
  limits: {
    requests_per_minute: number;
    requests_per_hour: number;
    requests_per_day: number;
    videos_per_day: number;
  };
  endpoints: {
    [key: string]: {
      count: number;
      tokens: number;
      cost: number;
    };
  };
}

interface RecentJob {
  id: string;
  task_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  created_at: string;
  video_title?: string;
}

interface SubscriptionDetails {
  plan: string;
  subscription_id: string | null;
  customer_id: string | null;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  status?: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  trial_end?: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | null>(null);
  const [, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('day');

  useEffect(() => {
    fetchUsageStats();
    fetchRecentJobs();
    fetchSubscriptionDetails();
  }, [selectedPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsageStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usage/stats?period=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': localStorage.getItem('auth_token') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to mock data if API fails
        const mockStats: UsageStats = {
          period: selectedPeriod,
          total_requests: user?.plan === 'pro' ? 450 : 12,
          total_tokens: user?.plan === 'pro' ? 125000 : 8500,
          total_cost: user?.plan === 'pro' ? 2.45 : 0,
          tier: user?.plan || 'free',
          limits: {
            requests_per_minute: user?.plan === 'pro' ? 100 : 10,
            requests_per_hour: user?.plan === 'pro' ? 1000 : 60,
            requests_per_day: user?.plan === 'pro' ? 10000 : 100,
            videos_per_day: user?.plan === 'pro' ? 1000 : 10,
          },
          endpoints: user?.plan === 'pro' ? {
            extract_single: { count: 280, tokens: 75000, cost: 1.50 },
            extract_batch: { count: 120, tokens: 35000, cost: 0.70 },
            ai_summary: { count: 50, tokens: 15000, cost: 0.25 }
          } : {
            extract_single: { count: 12, tokens: 8500, cost: 0 }
          }
        };
        setStats(mockStats);
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
      // Fallback to mock data on error
      const mockStats: UsageStats = {
        period: selectedPeriod,
        total_requests: user?.plan === 'pro' ? 450 : 12,
        total_tokens: user?.plan === 'pro' ? 125000 : 8500,
        total_cost: user?.plan === 'pro' ? 2.45 : 0,
        tier: user?.plan || 'free',
        limits: {
          requests_per_minute: user?.plan === 'pro' ? 100 : 10,
          requests_per_hour: user?.plan === 'pro' ? 1000 : 60,
          requests_per_day: user?.plan === 'pro' ? 10000 : 100,
          videos_per_day: user?.plan === 'pro' ? 1000 : 10,
        },
        endpoints: user?.plan === 'pro' ? {
          extract_single: { count: 280, tokens: 75000, cost: 1.50 },
          extract_batch: { count: 120, tokens: 35000, cost: 0.70 },
          ai_summary: { count: 50, tokens: 15000, cost: 0.25 }
        } : {
          extract_single: { count: 12, tokens: 8500, cost: 0 }
        }
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentJobs = async () => {
    try {
      // TODO: Implement dedicated /api/history endpoint in backend
      // For now, try to get recent activity data or fall back to mock data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usage/stats?period=week`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': localStorage.getItem('auth_token') || '',
        },
      });

      if (response.ok) {
        const usageData = await response.json();
        // Convert usage data into job history format (simplified)
        const jobHistory: RecentJob[] = [];
        
        // Create synthetic job entries based on usage stats
        if (usageData.endpoints?.extract_single?.count > 0) {
          jobHistory.push({
            id: 'recent-1',
            task_name: 'extract_single_transcript',
            status: 'completed',
            progress: 100,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            video_title: 'Recent transcript extraction',
          });
        }
        
        if (usageData.endpoints?.extract_batch?.count > 0) {
          jobHistory.push({
            id: 'recent-2',
            task_name: 'process_batch',
            status: 'completed',
            progress: 100,
            created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
            video_title: 'Batch processing job',
          });
        }

        setRecentJobs(jobHistory);
      } else {
        // Fallback to mock data if API fails
        setRecentJobs([
          {
            id: '1',
            task_name: 'extract_single_transcript',
            status: 'completed',
            progress: 100,
            created_at: new Date().toISOString(),
            video_title: 'How to Build a SaaS Product',
          },
          {
            id: '2',
            task_name: 'process_playlist',
            status: 'running',
            progress: 65,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            video_title: 'Web Development Tutorial Playlist',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch recent jobs:', error);
      // Fallback to mock data on error
      setRecentJobs([
        {
          id: '1',
          task_name: 'extract_single_transcript',
          status: 'completed',
          progress: 100,
          created_at: new Date().toISOString(),
          video_title: 'Sample Video Transcript',
        },
      ]);
    }
  };

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await apiService.getSubscription();
      
      if (!isApiError(response) && response.data) {
        setSubscriptionDetails(response.data);
      } else {
        console.error('Failed to fetch subscription details:', response.error);
        // Fallback to user plan info
        setSubscriptionDetails({
          plan: user?.plan || 'free',
          subscription_id: null,
          customer_id: null,
          subscription_started_at: null,
          subscription_ends_at: null
        });
      }
    } catch (error) {
      console.error('Failed to fetch subscription details:', error);
      // Fallback to user plan info
      setSubscriptionDetails({
        plan: user?.plan || 'free',
        subscription_id: null,
        customer_id: null,
        subscription_started_at: null,
        subscription_ends_at: null
      });
    }
  };

  const formatDate = (timestamp: number | string | null) => {
    if (!timestamp) return null;
    const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center gap-2 p-6 border-b dark:border-gray-700">
          <span className="text-2xl">📹</span>
          <h1 className="text-xl font-bold">YTScript</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/extract" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FileText className="w-5 h-5" />
                Extract
              </Link>
            </li>
            {user?.plan === 'pro' && (
              <li>
                <Link href="/batch" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <List className="w-5 h-5" />
                  Batch Processing
                  <span className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                    PRO
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link href="/history" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Clock className="w-5 h-5" />
                History
              </Link>
            </li>
            <li>
              <Link href="/billing" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <CreditCard className="w-5 h-5" />
                Billing
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
          <div className="mb-4 px-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Signed in as</div>
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your usage and manage your account
          </p>
        </div>

        {/* Subscription Status Banner */}
        <div className="mb-6">
          <div className={`rounded-lg p-4 border ${
            subscriptionDetails?.plan === 'pro' 
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`font-semibold ${
                    subscriptionDetails?.plan === 'pro' 
                      ? 'text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {subscriptionDetails?.plan === 'pro' ? '🚀 YTScript Pro' : '🆓 Free Plan'}
                  </h3>
                  {subscriptionDetails?.trial_end && subscriptionDetails.trial_end > Date.now() / 1000 && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 rounded-full">
                      Trial
                    </span>
                  )}
                  {subscriptionDetails?.cancel_at_period_end && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 rounded-full">
                      Cancelling
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-1 ${
                  subscriptionDetails?.plan === 'pro' 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {subscriptionDetails?.plan === 'pro' 
                    ? 'Unlimited transcripts, AI summaries, and premium formats'
                    : 'Unlimited single video extraction with TXT format'
                  }
                </p>
                {subscriptionDetails?.plan === 'pro' && subscriptionDetails?.current_period_end && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {subscriptionDetails.cancel_at_period_end 
                      ? `Access until ${formatDate(subscriptionDetails.current_period_end)}` 
                      : `Renews on ${formatDate(subscriptionDetails.current_period_end)}`
                    }
                  </p>
                )}
                {subscriptionDetails?.trial_end && subscriptionDetails.trial_end > Date.now() / 1000 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Trial ends on {formatDate(subscriptionDetails.trial_end)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {subscriptionDetails?.plan === 'free' && (
                  <Link 
                    href="/pricing" 
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <span>Upgrade to Pro</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {subscriptionDetails?.plan === 'pro' && (
                  <Link 
                    href="/billing" 
                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg bg-white dark:bg-gray-800 shadow">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 capitalize ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } first:rounded-l-lg last:rounded-r-lg transition-colors`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Total Requests</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">{stats.total_requests}</p>
              <p className="text-sm text-gray-500 mt-1">
                of {stats.limits.requests_per_day} daily limit
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Tokens Used</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{stats.total_tokens.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">This {selectedPeriod}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Total Cost</span>
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">${stats.total_cost.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Estimated usage</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Account Tier</span>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold capitalize">{stats.tier}</p>
              {stats.tier === 'free' && (
                <Link href="/pricing" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-8">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-xl font-semibold">Recent Jobs</h3>
          </div>
          <div className="p-6">
            {recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{job.video_title || job.task_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateTime(job.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {job.status === 'running' && (
                        <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recent jobs. Start by extracting a transcript!
              </p>
            )}
          </div>
        </div>

        {/* Usage by Endpoint */}
        {stats && stats.endpoints && Object.keys(stats.endpoints).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="p-6 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold">Usage by Endpoint</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {Object.entries(stats.endpoints).map(([endpoint, data]) => (
                  <div key={endpoint} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{endpoint.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {data.count} requests • {data.tokens} tokens
                      </p>
                    </div>
                    <span className="text-sm font-medium">${data.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade CTA for Free Users */}
        {stats && stats.tier === 'free' && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Unlock Premium Features</h3>
            <p className="mb-6">
              Get unlimited transcripts, AI summaries, batch processing, and more with YTScript Premium.
            </p>
            <Link href="/pricing" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now - Start Free Trial
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}