'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  List, 
  Users, 
  Plus, 
  X, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface BatchJob {
  id: string;
  name: string;
  type: 'videos' | 'channel' | 'playlist';
  urls: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: {
    completed: number;
    total: number;
  };
  results: Array<{
    url: string;
    video_id: string;
    title?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    transcript?: string;
    formats?: Record<string, string>;
    error?: string;
  }>;
  created_at: string;
  completed_at?: string;
}

export default function BatchProcessingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'jobs'>('create');

  // Create job form state
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState<'videos' | 'channel' | 'playlist'>('videos');
  const [urls, setUrls] = useState<string[]>(['']);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['txt', 'srt']);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.plan !== 'pro') {
      router.push('/pricing');
      return;
    }

    fetchJobs();
  }, [user, router]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/batch/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      setSelectedFormats([...selectedFormats, format]);
    } else {
      setSelectedFormats(selectedFormats.filter(f => f !== format));
    }
  };

  const createJob = async () => {
    if (!jobName.trim() || !urls.some(url => url.trim())) {
      alert('Please provide a job name and at least one URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          name: jobName.trim(),
          type: jobType,
          urls: urls.filter(url => url.trim()),
          formats: selectedFormats
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Batch job created successfully!');
        setJobName('');
        setUrls(['']);
        setActiveTab('jobs');
        fetchJobs();
      } else {
        alert(data.error || 'Failed to create batch job');
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('Failed to create batch job');
    } finally {
      setLoading(false);
    }
  };

  const pauseJob = async (jobId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/batch/${jobId}/pause`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to pause job:', error);
    }
  };

  const resumeJob = async (jobId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/batch/${jobId}/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to resume job:', error);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/batch/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'videos': return <Video className="w-4 h-4" />;
      case 'channel': return <Users className="w-4 h-4" />;
      case 'playlist': return <List className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  if (!user || user.plan !== 'pro') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-main py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Batch Processing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Process multiple videos, entire channels, or playlists simultaneously
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="card p-6 mb-8">
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Create Job
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              My Jobs ({jobs.length})
            </button>
          </div>

          {/* Create Job Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              {/* Job Name */}
              <div>
                <label htmlFor="job-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Job Name
                </label>
                <input
                  id="job-name"
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="My batch job"
                  className="input w-full"
                  disabled={loading}
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Processing Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    jobType === 'videos' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    <input
                      type="radio"
                      name="jobType"
                      value="videos"
                      checked={jobType === 'videos'}
                      onChange={(e) => setJobType(e.target.value as 'videos' | 'channel' | 'playlist')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Individual Videos</div>
                      <div className="text-sm text-gray-500">Process specific video URLs</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    jobType === 'channel' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    <input
                      type="radio"
                      name="jobType"
                      value="channel"
                      checked={jobType === 'channel'}
                      onChange={(e) => setJobType(e.target.value as 'videos' | 'channel' | 'playlist')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Entire Channel</div>
                      <div className="text-sm text-gray-500">Process all videos from channel</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    jobType === 'playlist' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                    <input
                      type="radio"
                      name="jobType"
                      value="playlist"
                      checked={jobType === 'playlist'}
                      onChange={(e) => setJobType(e.target.value as 'videos' | 'channel' | 'playlist')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <List className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Playlist</div>
                      <div className="text-sm text-gray-500">Process all videos in playlist</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* URLs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {jobType === 'videos' ? 'Video URLs' : 
                   jobType === 'channel' ? 'Channel URLs' : 'Playlist URLs'}
                </label>
                <div className="space-y-3">
                  {urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        placeholder={
                          jobType === 'videos' ? 'https://youtube.com/watch?v=...' :
                          jobType === 'channel' ? 'https://youtube.com/@channel or https://youtube.com/c/channel' :
                          'https://youtube.com/playlist?list=...'
                        }
                        className="input flex-1"
                        disabled={loading}
                      />
                      {urls.length > 1 && (
                        <button
                          onClick={() => removeUrlField(index)}
                          className="btn-ghost p-2"
                          disabled={loading}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addUrlField}
                    className="btn-secondary flex items-center gap-2"
                    disabled={loading || urls.length >= 10}
                  >
                    <Plus className="w-4 h-4" />
                    Add {jobType === 'videos' ? 'Video' : jobType === 'channel' ? 'Channel' : 'Playlist'}
                  </button>
                </div>
              </div>

              {/* Export Formats */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Export Formats
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { id: 'txt', name: 'TXT', desc: 'Plain text' },
                    { id: 'srt', name: 'SRT', desc: 'Subtitles' },
                    { id: 'json', name: 'JSON', desc: 'Structured' },
                    { id: 'pdf', name: 'PDF', desc: 'Professional' },
                    { id: 'docx', name: 'DOCX', desc: 'Word doc' },
                    { id: 'xlsx', name: 'XLSX', desc: 'Excel' },
                  ].map((format) => (
                    <label key={format.id} className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format.id)}
                        onChange={(e) => handleFormatChange(format.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{format.name}</div>
                        <div className="text-xs text-gray-500">{format.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-end">
                <button
                  onClick={createJob}
                  disabled={loading || !jobName.trim() || !urls.some(url => url.trim())}
                  className="btn-gradient px-6 py-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Create Batch Job
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No batch jobs yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create your first batch job to process multiple videos
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="btn-primary"
                  >
                    Create Batch Job
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(job.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {job.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {getStatusIcon(job.status)}
                            <span className="capitalize">{job.status}</span>
                            <span>•</span>
                            <span>{job.progress.completed}/{job.progress.total} completed</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {job.status === 'processing' && (
                          <button
                            onClick={() => pauseJob(job.id)}
                            className="btn-ghost p-2"
                            title="Pause"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {job.status === 'paused' && (
                          <button
                            onClick={() => resumeJob(job.id)}
                            className="btn-ghost p-2"
                            title="Resume"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="btn-ghost p-2 text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((job.progress.completed / job.progress.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(job.progress.completed / job.progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div>Type: <span className="capitalize">{job.type}</span></div>
                      <div>Created: {new Date(job.created_at).toLocaleString()}</div>
                      {job.completed_at && (
                        <div>Completed: {new Date(job.completed_at).toLocaleString()}</div>
                      )}
                    </div>

                    {/* Results Preview */}
                    {job.results.length > 0 && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-2">
                          View Results ({job.results.length} videos)
                        </summary>
                        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                          {job.results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {getStatusIcon(result.status)}
                                <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                  {result.title || result.video_id || result.url}
                                </span>
                              </div>
                              {result.status === 'completed' && (
                                <button className="btn-ghost p-1 ml-2">
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}