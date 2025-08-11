'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Download, FileText, Video, Clock, Languages, Sparkles, CheckCircle, AlertCircle, Copy, Lock, Star } from 'lucide-react';

interface TranscriptResult {
 success?: boolean;
 video_id?: string;
 transcript?: string;
 transcript_text?: string;
 transcript_markdown?: string;
 metadata?: {
  video_id?: string;
  title?: string;
  channel?: string;
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
  pdf?: {
   data?: string;
   encoding?: string;
   content_type?: string;
   error?: string;
   upgrade_url?: string;
   message?: string;
  };
  docx?: {
   data?: string;
   encoding?: string;
   content_type?: string;
   error?: string;
   upgrade_url?: string;
   message?: string;
  };
  xlsx?: {
   data?: string;
   encoding?: string;
   content_type?: string;
   error?: string;
   upgrade_url?: string;
   message?: string;
  };
 };
 cached?: boolean;
 ai_summary?: {
  summary: string;
  type: string;
  metadata: {
   original_word_count: number;
   summary_word_count: number;
   compression_ratio: number;
   tokens_used: number;
   model: string;
   timestamp: string;
  };
 };
 key_points?: string[];
}

export default function TranscriptExtractor() {
 const { user } = useAuth();
 const { showSuccess, showError, showWarning } = useToast();
 const [url, setUrl] = useState('');
 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState<TranscriptResult | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [selectedLanguage, setSelectedLanguage] = useState('en');
 const [selectedFormats, setSelectedFormats] = useState<string[]>(['txt']);
 const [copied, setCopied] = useState(false);
 const [includeSummary, setIncludeSummary] = useState(false);
 const [summaryType, setSummaryType] = useState('concise');

 const isPremium = user?.plan === 'pro';

 const handleExtract = async () => {
  if (!url.trim()) {
   setError('Please enter a YouTube URL');
   showWarning('Missing URL', 'Please enter a YouTube URL');
   return;
  }

  // Basic YouTube URL validation
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
  if (!youtubeRegex.test(url.trim())) {
   setError('Please enter a valid YouTube URL');
   showError('Invalid URL', 'Please enter a valid YouTube URL');
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
    credentials: 'include', // Include cookies for OAuth authentication
    body: JSON.stringify({ 
     url: url.trim(),
     language: selectedLanguage,
     formats: selectedFormats,
     include_summary: includeSummary,
     summary_type: summaryType
    }),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.error || 'Failed to extract transcript');
   }

   setResult(data);
   showSuccess('Transcript Extracted!', `Successfully extracted transcript for video ${data.video_id || ''}`);
  } catch (err) {
   const errorMessage = err instanceof Error ? err.message : 'An error occurred while extracting the transcript';
   setError(errorMessage);
   showError('Extraction Failed', errorMessage);
  } finally {
   setLoading(false);
  }
 };

 const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
 };

 const downloadPremiumFormat = (formatData: { error?: string; message?: string; data?: string; content_type?: string }, format: string, videoId: string) => {
  if (formatData.error) {
   alert(`${formatData.message || formatData.error}`);
   return;
  }

  if (!formatData.data) {
   alert('No data available for download');
   return;
  }

  try {
   // Decode base64 data
   const binaryData = atob(formatData.data);
   const bytes = new Uint8Array(binaryData.length);
   for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
   }

   const blob = new Blob([bytes], { type: formatData.content_type });
   const downloadUrl = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = downloadUrl;
   a.download = `transcript-${videoId}.${format}`;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
   console.error('Download error:', err);
   alert('Failed to download file');
  }
 };

 const handleFormatChange = (format: string, checked: boolean) => {
  if (checked) {
   setSelectedFormats([...selectedFormats, format]);
  } else {
   setSelectedFormats(selectedFormats.filter(f => f !== format));
  }
 };

 const copyToClipboard = async (text: string) => {
  try {
   await navigator.clipboard.writeText(text);
   setCopied(true);
   showSuccess('Copied!', 'Transcript copied to clipboard');
   setTimeout(() => setCopied(false), 2000);
  } catch (err) {
   console.error('Failed to copy text:', err);
   showError('Copy Failed', 'Failed to copy transcript to clipboard');
  }
 };

 const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !loading) {
   handleExtract();
  }
 };

 const getVideoId = () => result?.metadata?.video_id || result?.video_id || 'video';
 const getTranscriptText = () => result?.transcript || result?.transcript_text || '';
 const getWordCount = () => result?.metadata?.word_count || 0;
 const getDuration = () => {
  const duration = result?.metadata?.duration;
  if (!duration) return 'N/A';
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
 };

 return (
  <div className="w-full max-w-4xl mx-auto">
   {/* Main Extraction Interface */}
   <div className="card p-8 mb-8">
    <div className="flex items-center gap-3 mb-6">
     <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
      <Video className="w-5 h-5 text-white" />
     </div>
     <h2 className="text-2xl font-bold text-gray-900">
      Extract YouTube Transcript
     </h2>
    </div>
    
    <div className="space-y-6">
     {/* URL Input */}
     <div>
      <label htmlFor="youtube-url" className="block text-sm font-semibold text-gray-700 mb-2">
       YouTube URL
      </label>
      <div className="relative">
       <input
        id="youtube-url"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
        className="input pl-4 pr-12"
        disabled={loading}
       />
       <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <Video className="w-5 h-5 text-gray-400" />
       </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
       Free and unlimited • No registration required
      </p>
     </div>

     {/* Language Selection */}
     <div>
      <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
       <Languages className="inline-block w-4 h-4 mr-1" />
       Language Preference
      </label>
      <select
       id="language"
       value={selectedLanguage}
       onChange={(e) => setSelectedLanguage(e.target.value)}
       className="input w-full sm:w-auto min-w-[200px]"
       disabled={loading}
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
      <label className="block text-sm font-semibold text-gray-700 mb-3">
       <Download className="inline-block w-4 h-4 mr-1" />
       Export Formats
      </label>
      <div className="space-y-3">
       {/* Free Formats */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
         <input
          type="checkbox"
          checked={selectedFormats.includes('txt')}
          onChange={(e) => handleFormatChange('txt', e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
         />
         <div>
          <div className="font-medium text-gray-900">TXT</div>
          <div className="text-xs text-gray-500">Plain text • Free</div>
         </div>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
         <input
          type="checkbox"
          checked={selectedFormats.includes('srt')}
          onChange={(e) => handleFormatChange('srt', e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
         />
         <div>
          <div className="font-medium text-gray-900">SRT</div>
          <div className="text-xs text-gray-500">Subtitle format • Free</div>
         </div>
        </label>

        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
         <input
          type="checkbox"
          checked={selectedFormats.includes('json')}
          onChange={(e) => handleFormatChange('json', e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
         />
         <div>
          <div className="font-medium text-gray-900">JSON</div>
          <div className="text-xs text-gray-500">Structured data • Free</div>
         </div>
        </label>
       </div>

       {/* Premium Formats */}
       <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2 mb-2">
         <Star className="w-4 h-4 text-yellow-500" />
         <span className="text-sm font-medium text-gray-700">Premium Formats</span>
         {!isPremium && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
           Pro Required
          </span>
         )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
         <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
          isPremium 
           ? 'border-purple-200 hover:bg-purple-50' 
           : 'border-gray-200 opacity-60 cursor-not-allowed'
         }`}>
          <input
           type="checkbox"
           checked={selectedFormats.includes('pdf')}
           onChange={(e) => isPremium && handleFormatChange('pdf', e.target.checked)}
           disabled={!isPremium}
           className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
          />
          <div>
           <div className="font-medium text-gray-900 flex items-center gap-1">
            PDF
            {!isPremium && <Lock className="w-3 h-3 text-gray-400" />}
           </div>
           <div className="text-xs text-gray-500">Professional format</div>
          </div>
         </label>

         <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
          isPremium 
           ? 'border-purple-200 hover:bg-purple-50' 
           : 'border-gray-200 opacity-60 cursor-not-allowed'
         }`}>
          <input
           type="checkbox"
           checked={selectedFormats.includes('docx')}
           onChange={(e) => isPremium && handleFormatChange('docx', e.target.checked)}
           disabled={!isPremium}
           className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
          />
          <div>
           <div className="font-medium text-gray-900 flex items-center gap-1">
            DOCX
            {!isPremium && <Lock className="w-3 h-3 text-gray-400" />}
           </div>
           <div className="text-xs text-gray-500">Microsoft Word</div>
          </div>
         </label>

         <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
          isPremium 
           ? 'border-purple-200 hover:bg-purple-50' 
           : 'border-gray-200 opacity-60 cursor-not-allowed'
         }`}>
          <input
           type="checkbox"
           checked={selectedFormats.includes('xlsx')}
           onChange={(e) => isPremium && handleFormatChange('xlsx', e.target.checked)}
           disabled={!isPremium}
           className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
          />
          <div>
           <div className="font-medium text-gray-900 flex items-center gap-1">
            XLSX
            {!isPremium && <Lock className="w-3 h-3 text-gray-400" />}
           </div>
           <div className="text-xs text-gray-500">Microsoft Excel</div>
          </div>
         </label>
        </div>
       </div>
      </div>
     </div>

     {/* AI Summary Options - Pro Users Only */}
     {isPremium && (
      <div className="border-t border-gray-200 pt-4">
       <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
         <Sparkles className="w-5 h-5 text-purple-500" />
         <label htmlFor="ai-summary" className="text-sm font-semibold text-gray-700">
          AI-Powered Summary (GPT-4)
         </label>
         <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          PRO
         </span>
        </div>
        <div className="flex items-center">
         <input
          id="ai-summary"
          type="checkbox"
          checked={includeSummary}
          onChange={(e) => setIncludeSummary(e.target.checked)}
          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
         />
        </div>
       </div>
       
       {includeSummary && (
        <div className="ml-7 space-y-2 animate-fade-in">
         <label htmlFor="summary-type" className="block text-xs font-medium text-gray-600">
          Summary Type
         </label>
         <select
          id="summary-type"
          value={summaryType}
          onChange={(e) => setSummaryType(e.target.value)}
          className="input text-sm py-1"
         >
          <option value="concise">Concise (2-3 paragraphs)</option>
          <option value="detailed">Detailed (comprehensive)</option>
          <option value="bullet_points">Bullet Points</option>
          <option value="chapters">Chapter Divisions</option>
          <option value="academic">Academic Style</option>
          <option value="business">Executive Summary</option>
         </select>
        </div>
       )}
      </div>
     )}

     {/* Extract Button */}
     <button
      onClick={handleExtract}
      disabled={loading || !url.trim()}
      className="btn-gradient w-full sm:w-auto min-w-[200px] focus-visible"
     >
      {loading ? (
       <span className="flex items-center justify-center gap-2">
        <Loader2 className="animate-spin h-5 w-5" />
        Extracting Transcript...
       </span>
      ) : (
       <span className="flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5" />
        Extract Transcript
       </span>
      )}
     </button>

     {/* Error Display */}
     {error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
       <div className="flex items-start gap-2">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <p className="text-red-700">{error}</p>
       </div>
      </div>
     )}
    </div>
   </div>

   {/* Results Section */}
   {result && (
    <div className="card p-8 animate-slide-up">
     {/* Success Header */}
     <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
      <CheckCircle className="w-6 h-6 text-green-600" />
      <div>
       <p className="font-semibold text-green-700">
        ✅ Transcript extracted successfully!
       </p>
       <p className="text-sm text-green-600">
        Video ID: {getVideoId()} • {result.metadata?.segment_count || 0} segments • Duration: {getDuration()}
        {result.cached && ' • Cached result'}
       </p>
      </div>
     </div>

     {/* Video Metadata */}
     {result.metadata && (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
       <h3 className="text-lg font-semibold mb-3 text-gray-900">Video Information</h3>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {result.metadata.title && (
         <div>
          <span className="font-medium text-gray-600">Title:</span>
          <p className="mt-1 text-gray-900">{result.metadata.title}</p>
         </div>
        )}
        {result.metadata.channel && (
         <div>
          <span className="font-medium text-gray-600">Channel:</span>
          <p className="mt-1 text-gray-900">{result.metadata.channel}</p>
         </div>
        )}
        <div>
         <span className="font-medium text-gray-600">Word Count:</span>
         <p className="mt-1 text-gray-900">{getWordCount().toLocaleString()} words</p>
        </div>
        <div>
         <span className="font-medium text-gray-600">Language:</span>
         <p className="mt-1 text-gray-900">{(result.metadata.language || selectedLanguage).toUpperCase()}</p>
        </div>
        <div>
         <span className="font-medium text-gray-600">Duration:</span>
         <p className="mt-1 text-gray-900 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {getDuration()}
         </p>
        </div>
        <div>
         <span className="font-medium text-gray-600">Segments:</span>
         <p className="mt-1 text-gray-900">{result.metadata.segment_count || 0}</p>
        </div>
       </div>
      </div>
     )}

     {/* AI Summary Display */}
     {result.ai_summary && (
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
       <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Generated Summary</h3>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
         {result.ai_summary.type.replace('_', ' ').toUpperCase()}
        </span>
       </div>
       
       <div className="prose prose-sm max-w-none text-gray-700">
        <p className="whitespace-pre-wrap">{result.ai_summary.summary}</p>
       </div>
       
       {result.key_points && result.key_points.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-200">
         <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
         <ul className="space-y-1">
          {result.key_points.map((point, index) => (
           <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{point}</span>
           </li>
          ))}
         </ul>
        </div>
       )}
       
       {result.ai_summary.metadata && (
        <div className="mt-4 pt-4 border-t border-purple-200">
         <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <span>Compression: {result.ai_summary.metadata.compression_ratio}%</span>
          <span>Model: {result.ai_summary.metadata.model}</span>
          <span>Words: {result.ai_summary.metadata.original_word_count} → {result.ai_summary.metadata.summary_word_count}</span>
         </div>
        </div>
       )}
      </div>
     )}

     {/* Download Actions */}
     <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Download Options</h3>
      
      {/* Free Format Downloads */}
      <div className="mb-4">
       <h4 className="text-sm font-medium text-gray-700 mb-2">Free Formats</h4>
       <div className="flex flex-wrap gap-3">
        {result.formats?.txt && (
         <button
          onClick={() => downloadFile(result.formats!.txt || '', `transcript-${getVideoId()}.txt`, 'text/plain')}
          className="btn-primary flex items-center justify-center gap-2"
         >
          <FileText className="w-4 h-4" />
          Download TXT
         </button>
        )}
        {result.formats?.srt && (
         <button
          onClick={() => downloadFile(result.formats!.srt || '', `transcript-${getVideoId()}.srt`, 'text/plain')}
          className="btn-secondary flex items-center justify-center gap-2"
         >
          <Download className="w-4 h-4" />
          Download SRT
         </button>
        )}
        {result.formats?.json && result.formats!.json && (
         <button
          onClick={() => downloadFile(JSON.stringify(result.formats!.json, null, 2), `transcript-${getVideoId()}.json`, 'application/json')}
          className="btn-secondary flex items-center justify-center gap-2"
         >
          <Download className="w-4 h-4" />
          Download JSON
         </button>
        )}
        <button
         onClick={() => copyToClipboard(getTranscriptText())}
         className="btn-ghost flex items-center justify-center gap-2"
        >
         <Copy className="w-4 h-4" />
         {copied ? 'Copied!' : 'Copy Text'}
        </button>
       </div>
      </div>

      {/* Premium Format Downloads */}
      {(result.formats?.pdf || result.formats?.docx || result.formats?.xlsx) && (
       <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
         <Star className="w-4 h-4 text-yellow-500" />
         Premium Formats
        </h4>
        <div className="flex flex-wrap gap-3">
         {result.formats?.pdf && (
          <button
           onClick={() => {
            if (typeof result.formats?.pdf === 'object' && result.formats!.pdf.error) {
             alert(result.formats!.pdf.message || result.formats!.pdf.error);
            } else if (typeof result.formats?.pdf === 'object') {
             downloadPremiumFormat(result.formats!.pdf, 'pdf', getVideoId());
            }
           }}
           className={`btn-gradient flex items-center justify-center gap-2 ${
            typeof result.formats?.pdf === 'object' && result.formats!.pdf.error ? 'opacity-50' : ''
           }`}
          >
           <Download className="w-4 h-4" />
           {typeof result.formats?.pdf === 'object' && result.formats!.pdf.error ? 'PDF (Pro Required)' : 'Download PDF'}
          </button>
         )}
         {result.formats?.docx && (
          <button
           onClick={() => {
            if (typeof result.formats?.docx === 'object' && result.formats!.docx.error) {
             alert(result.formats!.docx.message || result.formats!.docx.error);
            } else if (typeof result.formats?.docx === 'object') {
             downloadPremiumFormat(result.formats!.docx, 'docx', getVideoId());
            }
           }}
           className={`btn-gradient flex items-center justify-center gap-2 ${
            typeof result.formats?.docx === 'object' && result.formats!.docx.error ? 'opacity-50' : ''
           }`}
          >
           <Download className="w-4 h-4" />
           {typeof result.formats?.docx === 'object' && result.formats!.docx.error ? 'DOCX (Pro Required)' : 'Download DOCX'}
          </button>
         )}
         {result.formats?.xlsx && (
          <button
           onClick={() => {
            if (typeof result.formats?.xlsx === 'object' && result.formats!.xlsx.error) {
             alert(result.formats!.xlsx.message || result.formats!.xlsx.error);
            } else if (typeof result.formats?.xlsx === 'object') {
             downloadPremiumFormat(result.formats!.xlsx, 'xlsx', getVideoId());
            }
           }}
           className={`btn-gradient flex items-center justify-center gap-2 ${
            typeof result.formats?.xlsx === 'object' && result.formats!.xlsx.error ? 'opacity-50' : ''
           }`}
          >
           <Download className="w-4 h-4" />
           {typeof result.formats?.xlsx === 'object' && result.formats!.xlsx.error ? 'XLSX (Pro Required)' : 'Download XLSX'}
          </button>
         )}
        </div>
       </div>
      )}
     </div>

     {/* Transcript Preview */}
     <details className="group">
      <summary className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-electric-600 transition-colors py-2 flex items-center gap-2">
       <span className="transform group-open:rotate-90 transition-transform">▶</span>
       Preview Transcript
      </summary>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
       <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
        {getTranscriptText() ? 
         getTranscriptText().substring(0, 2000) + 
         (getTranscriptText().length > 2000 ? '\n\n... (truncated for preview - download full transcript)' : '')
         : 'No transcript content available'
        }
       </pre>
      </div>
     </details>
    </div>
   )}

   {/* Pro Features Teaser */}
   <div className="card-hover p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
     <Sparkles className="w-5 h-5 text-neon-purple" />
     Unlock Pro Features
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
     <div className="flex items-center gap-2 text-sm text-gray-600">
      <CheckCircle className="w-4 h-4 text-green-500" />
      AI-powered summaries with GPT-4
     </div>
     <div className="flex items-center gap-2 text-sm text-gray-600">
      <CheckCircle className="w-4 h-4 text-green-500" />
      Batch process channels & playlists
     </div>
     <div className="flex items-center gap-2 text-sm text-gray-600">
      <CheckCircle className="w-4 h-4 text-green-500" />
      Export to PDF, Word, Excel
     </div>
     <div className="flex items-center gap-2 text-sm text-gray-600">
      <CheckCircle className="w-4 h-4 text-green-500" />
      90-day cloud storage
     </div>
    </div>
    <button className="btn-gradient w-full sm:w-auto">
     Upgrade to Pro - $20/month
    </button>
   </div>
  </div>
 );
}