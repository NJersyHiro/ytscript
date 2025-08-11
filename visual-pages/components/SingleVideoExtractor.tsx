'use client';

import { useState } from 'react';

interface TranscriptResult {
  success?: boolean;
  video_id?: string;
  transcript?: string;  // New API field
  transcript_text?: string;  // For backward compatibility
  transcript_markdown?: string;
  metadata?: {
    video_id?: string;
    word_count?: number;
    language?: string;
    duration?: number;
    segment_count?: number;
  };
  formats?: {
    txt?: string;
    srt?: string;
    json?: Array<{
      text: string;
      start: number;
      duration: number;
    }>;
    pdf?: string;
    docx?: string;
  };
  cached?: boolean;
}

export default function SingleVideoExtractor() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract transcript');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Extract YouTube Transcript
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL or Video ID
            </label>
            <div className="flex gap-2">
              <input
                id="youtube-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or video ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                onClick={handleExtract}
                disabled={loading || !url.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Extracting...
                  </span>
                ) : (
                  'Extract'
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Free and unlimited • No registration required
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✅ Transcript extracted successfully!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Video ID: {result.metadata?.video_id || result.video_id || 'N/A'} • {result.metadata?.segment_count || 0} segments • 
                  Duration: {result.metadata?.duration ? `${Math.floor(result.metadata.duration / 60)}:${String(Math.floor(result.metadata.duration % 60)).padStart(2, '0')}` : 'N/A'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadFile(result.transcript || result.transcript_text || '', `transcript-${result.metadata?.video_id || result.video_id || 'video'}.txt`, 'text/plain')}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📄 Download TXT
                </button>
                <button
                  onClick={() => downloadFile(result.transcript_markdown || '', `transcript-${result.metadata?.video_id || result.video_id || 'video'}.md`, 'text/markdown')}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📝 Download Markdown
                </button>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                  Preview Transcript
                </summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {result.transcript ? result.transcript.substring(0, 1000) : 'No transcript available'}
                    {result.transcript && result.transcript.length > 1000 && '\n\n... (truncated for preview)'}
                  </pre>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>

      {/* Pro Features Teaser */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🚀 Unlock Pro Features
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✨ AI-powered summaries with GPT-4</li>
          <li>📁 Batch process entire channels & playlists</li>
          <li>📊 Export to PDF, Word, Excel formats</li>
          <li>💾 90-day storage (vs 24 hours)</li>
          <li>⚡ Priority processing & no rate limits</li>
        </ul>
        <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
          Upgrade to Pro - $20/month
        </button>
      </div>
    </div>
  );
}