'use client';

import Link from 'next/link';
import TranscriptExtractor from '@/components/TranscriptExtractor';
import { ArrowLeft, Video } from 'lucide-react';

export default function ExtractPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/20 dark:border-gray-800/20">
        <div className="container-main py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">YTScript</h1>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="btn-ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <Link href="/" className="btn-secondary">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-main py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Extract YouTube Transcripts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Extract transcripts from any YouTube video instantly. Free for single videos, 
            upgrade for batch processing and AI summaries.
          </p>
        </div>

        {/* Main Extractor */}
        <div className="max-w-4xl mx-auto">
          <TranscriptExtractor />
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">10,000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Videos Processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">5M+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Words Extracted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">&lt;10s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Processing</div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Need More Power?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Upgrade to Pro for batch processing, AI summaries, advanced exports, and 90-day cloud storage.
            </p>
            <Link href="/dashboard" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade to Pro - $20/month
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}