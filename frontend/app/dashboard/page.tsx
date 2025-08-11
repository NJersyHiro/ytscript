'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
 BarChart3, 
 FileText, 
 Clock, 
 TrendingUp, 
 Calendar,
 CreditCard,
 LogOut,
 ArrowRight,
 Zap
} from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardContent() {
 const { user, logout } = useAuth();
 const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('month');

 const handleLogout = () => {
  logout();
 };

 // Mock data for visualization
 const stats = {
  videosProcessed: user?.plan === 'pro' ? 280 : 12,
  wordsExtracted: user?.plan === 'pro' ? 75000 : 8500,
  timesSaved: user?.plan === 'pro' ? '14 hours' : '2 hours',
  accuracy: '99.9%'
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
   {/* Header */}
   <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="flex justify-between items-center py-4">
      <div className="flex items-center gap-3">
       <Link href="/" className="flex items-center gap-2 group">
        <div className="text-2xl">📹</div>
        <h1 className="text-xl font-bold gradient-text">YTScript</h1>
       </Link>
       <span className="text-gray-500">/ Dashboard</span>
      </div>
      
      <div className="flex items-center gap-4">
       <div className="text-right">
        <div className="text-sm text-gray-500">Signed in as</div>
        <div className="font-semibold text-gray-900">{user?.email || 'demo@example.com'}</div>
       </div>
       <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
       >
        <LogOut className="w-4 h-4" />
        Sign Out
       </button>
      </div>
     </div>
    </div>
   </header>

   {/* Main Content */}
   <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Welcome Section */}
    <div className="mb-8">
     <h2 className="text-3xl font-bold text-gray-900 mb-2">
      Welcome back!
     </h2>
     <p className="text-gray-600">
      Monitor your usage and manage your account
     </p>
    </div>

    {/* Plan Status Card */}
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
     <div className="flex items-center justify-between">
      <div>
       <h3 className="text-xl font-bold text-gray-900 mb-1">
        {user?.plan === 'pro' ? '⭐ Pro Plan' : '🆓 Free Plan'}
       </h3>
       <p className="text-gray-600">
        {user?.plan === 'pro' 
         ? 'Unlimited transcripts, AI summaries, and premium formats'
         : 'Unlimited single video extraction with TXT format'
        }
       </p>
      </div>
      {user?.plan !== 'pro' && (
       <Link 
        href="/#pricing" 
        className="btn-gradient flex items-center gap-2"
       >
        Upgrade to Pro
        <ArrowRight className="w-4 h-4" />
       </Link>
      )}
     </div>
    </div>

    {/* Time Period Selector */}
    <div className="flex gap-2 mb-6">
     {(['day', 'week', 'month'] as const).map((period) => (
      <button
       key={period}
       onClick={() => setTimePeriod(period)}
       className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        timePeriod === period
         ? 'bg-blue-600 text-white'
         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
       }`}
      >
       {period.charAt(0).toUpperCase() + period.slice(1)}
      </button>
     ))}
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
     <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
       <FileText className="w-8 h-8 text-blue-600" />
       <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900">
       {stats.videosProcessed}
      </div>
      <div className="text-sm text-gray-500 mt-1">
       Videos Processed
      </div>
     </div>

     <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
       <BarChart3 className="w-8 h-8 text-purple-600" />
       <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900">
       {stats.wordsExtracted.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500 mt-1">
       Words Extracted
      </div>
     </div>

     <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
       <Clock className="w-8 h-8 text-green-600" />
       <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <div className="text-2xl font-bold text-gray-900">
       {stats.timesSaved}
      </div>
      <div className="text-sm text-gray-500 mt-1">
       Time Saved
      </div>
     </div>

     <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
       <Zap className="w-8 h-8 text-yellow-600" />
       <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
        ACTIVE
       </span>
      </div>
      <div className="text-2xl font-bold text-gray-900">
       {stats.accuracy}
      </div>
      <div className="text-sm text-gray-500 mt-1">
       Accuracy Rate
      </div>
     </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
     <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-900">
       Recent Activity
      </h3>
      <Calendar className="w-5 h-5 text-gray-400" />
     </div>
     
     <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
       <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
      </div>
      <p className="text-gray-500 mb-4">
       No recent activity yet
      </p>
      <p className="text-sm text-gray-400 mb-6">
       Start extracting transcripts to see your activity here
      </p>
      <Link href="/" className="btn-gradient inline-flex items-center gap-2">
       <Zap className="w-4 h-4" />
       Extract Your First Transcript
      </Link>
     </div>
    </div>

    {/* Pro Features Reminder for Free Users */}
    {user?.plan !== 'pro' && (
     <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
      <h3 className="text-2xl font-bold mb-4">
       🚀 Unlock Pro Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
       <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
         ✓
        </div>
        <div>
         <div className="font-semibold">AI-Powered Summaries</div>
         <div className="text-sm text-white/80">Get intelligent summaries with GPT-4</div>
        </div>
       </div>
       <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
         ✓
        </div>
        <div>
         <div className="font-semibold">Batch Processing</div>
         <div className="text-sm text-white/80">Process entire channels & playlists</div>
        </div>
       </div>
       <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
         ✓
        </div>
        <div>
         <div className="font-semibold">Premium Formats</div>
         <div className="text-sm text-white/80">Export to PDF, Word, Excel</div>
        </div>
       </div>
       <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
         ✓
        </div>
        <div>
         <div className="font-semibold">Cloud Storage</div>
         <div className="text-sm text-white/80">90-day transcript storage</div>
        </div>
       </div>
      </div>
      <Link href="/#pricing" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
       Upgrade to Pro - $20/month
      </Link>
     </div>
    )}
   </main>
  </div>
 );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}