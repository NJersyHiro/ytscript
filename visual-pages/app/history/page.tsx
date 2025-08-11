'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Download, 
  Eye, 
  Trash2, 
  Search, 
  Calendar,
  FileText,
  Video,
  ArrowLeft,
  Filter
} from 'lucide-react';

interface HistoryItem {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  duration: number;
  extractedAt: string;
  wordCount: number;
  language: string;
  status: 'completed' | 'processing' | 'failed';
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would fetch from API
    const mockHistory: HistoryItem[] = [
      {
        id: '1',
        videoId: 'dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
        channel: 'Rick Astley',
        duration: 212,
        extractedAt: '2024-08-10T10:30:00Z',
        wordCount: 156,
        language: 'en',
        status: 'completed'
      },
      {
        id: '2',
        videoId: 'kJQP7kiw5Fk',
        title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
        channel: 'LuisFonsiVEVO',
        duration: 281,
        extractedAt: '2024-08-10T09:15:00Z',
        wordCount: 312,
        language: 'es',
        status: 'completed'
      },
      {
        id: '3',
        videoId: 'processing123',
        title: 'Processing Video - Example',
        channel: 'Test Channel',
        duration: 0,
        extractedAt: '2024-08-10T11:00:00Z',
        wordCount: 0,
        language: 'en',
        status: 'processing'
      }
    ];
    
    setTimeout(() => {
      setHistoryItems(mockHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'processing':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
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
              <Link href="/extract" className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FileText className="w-5 h-5" />
                Extract
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <Clock className="w-5 h-5" />
                History
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Extraction History</h2>
          <p className="text-gray-600 dark:text-gray-400">View and manage your transcript extractions</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or channel..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="input min-w-[120px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'processing' | 'completed' | 'failed')}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* History Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No history found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No extractions match your search criteria.' 
                  : 'Start extracting transcripts to see them here.'}
              </p>
              <Link href="/extract" className="btn-primary">
                Extract Your First Transcript
              </Link>
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          {item.channel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.duration > 0 ? formatDuration(item.duration) : 'Processing...'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.extractedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {item.wordCount > 0 ? `${item.wordCount.toLocaleString()} words` : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {item.status === 'completed' && (
                        <>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade CTA for Free Users */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Upgrade for Extended History</h3>
              <p className="text-blue-100">
                Free users get 7-day history. Upgrade to Pro for 90-day storage and advanced features.
              </p>
            </div>
            <Link href="/dashboard" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}