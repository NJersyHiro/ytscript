'use client';

import { useState } from 'react';
import { Loader2, Download, FileText, Globe, Sparkles } from 'lucide-react';

interface TranscriptResult {
  transcript: string;
  metadata: {
    video_id: string;
    title?: string;
    channel?: string;
    duration?: number;
    word_count: number;
    language: string;
  };
  formats?: {
    txt?: string;
    srt?: string;
    pdf?: string;
    docx?: string;
  };
  summary?: {
    text: string;
    key_points: string[];
  };
}

export default function TranscriptForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('txt');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          language: selectedLanguage,
          formats: [selectedFormat],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract transcript');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadTranscript = (format: string) => {
    if (!result || !result.formats) return;

    const content = result.formats[format as keyof typeof result.formats];
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${result.metadata.video_id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Options Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Language Selection */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="inline-block w-4 h-4 mr-1" />
                Language
              </label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="it">Italian</option>
              </select>
            </div>

            {/* Format Selection */}
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="inline-block w-4 h-4 mr-1" />
                Export Format
              </label>
              <select
                id="format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="txt">Plain Text</option>
                <option value="srt">SRT Subtitles</option>
                <option value="pdf" disabled>PDF (Premium)</option>
                <option value="docx" disabled>Word (Premium)</option>
                <option value="xlsx" disabled>Excel (Premium)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Extracting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Extract Transcript
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          {/* Metadata */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Video Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {result.metadata.title && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Title:</span>
                  <p className="mt-1">{result.metadata.title}</p>
                </div>
              )}
              {result.metadata.channel && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Channel:</span>
                  <p className="mt-1">{result.metadata.channel}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Word Count:</span>
                <p className="mt-1">{result.metadata.word_count.toLocaleString()} words</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Language:</span>
                <p className="mt-1">{result.metadata.language.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Transcript Preview */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Transcript Preview</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">
                {result.transcript.substring(0, 500)}...
              </p>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => downloadTranscript('txt')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download TXT
            </button>
            {result.formats?.srt && (
              <button
                onClick={() => downloadTranscript('srt')}
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download SRT
              </button>
            )}
          </div>

          {/* Upgrade CTA for Premium Features */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Want more?</strong> Upgrade to Premium for PDF/DOCX exports, AI summaries, batch processing, and more!
            </p>
            <a href="/signup?plan=premium" className="inline-block mt-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Start Free Trial →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}