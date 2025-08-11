'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  User, 
  Bell, 
 
  Moon, 
  Sun, 
  Monitor,
  Key, 
  Trash2, 
  Download,
  Upload,
  Shield,
  Video,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    defaultExportFormat: 'txt' | 'markdown' | 'pdf' | 'docx';
    autoSave: boolean;
    showTimestamps: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    processingComplete: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
  };
  privacy: {
    publicProfile: boolean;
    dataRetention: '7d' | '30d' | '90d';
    analyticsOptOut: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy' | 'security'>('profile');

  useEffect(() => {
    // Mock data - in real app this would fetch from API
    const mockSettings: UserSettings = {
      profile: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      },
      preferences: {
        theme: 'system',
        language: 'en',
        defaultExportFormat: 'txt',
        autoSave: true,
        showTimestamps: false
      },
      notifications: {
        emailNotifications: true,
        processingComplete: true,
        weeklyDigest: false,
        productUpdates: true
      },
      privacy: {
        publicProfile: false,
        dataRetention: '30d',
        analyticsOptOut: false
      }
    };

    setTimeout(() => {
      setSettings(mockSettings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    // Mock API call - in real app this would save to API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSettings = (section: keyof UserSettings, field: string, value: string | boolean) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    });
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
                <Settings className="w-5 h-5" />
                Settings
              </div>
            </li>
          </ul>
        </nav>

        {/* Settings Navigation */}
        <nav className="p-4 border-t dark:border-gray-700">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'preferences'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                Preferences
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Bell className="w-4 h-4" />
                Notifications
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                Privacy
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Key className="w-4 h-4" />
                Security
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your account and application preferences</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Settings Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
          {/* Profile Settings */}
          {activeTab === 'profile' && settings && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-ghost text-sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </button>
                      <button className="btn-ghost text-sm text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Used for account recovery and notifications
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Settings */}
          {activeTab === 'preferences' && settings && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Preferences</h3>
              
              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSettings('preferences', 'theme', theme)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          settings.preferences.theme === theme
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          {getThemeIcon(theme)}
                        </div>
                        <div className="text-sm font-medium capitalize">{theme}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    className="input"
                    value={settings.preferences.language}
                    onChange={(e) => updateSettings('preferences', 'language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                {/* Default Export Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Export Format
                  </label>
                  <select
                    className="input"
                    value={settings.preferences.defaultExportFormat}
                    onChange={(e) => updateSettings('preferences', 'defaultExportFormat', e.target.value)}
                  >
                    <option value="txt">Plain Text (.txt)</option>
                    <option value="markdown">Markdown (.md)</option>
                    <option value="pdf">PDF (.pdf) - Pro Only</option>
                    <option value="docx">Word Document (.docx) - Pro Only</option>
                  </select>
                </div>

                {/* Toggle Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-save transcripts</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save transcripts to your history</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.preferences.autoSave}
                      onChange={(e) => updateSettings('preferences', 'autoSave', e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Show timestamps</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display timestamps in transcript output</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.preferences.showTimestamps}
                      onChange={(e) => updateSettings('preferences', 'showTimestamps', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && settings && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => updateSettings('notifications', 'emailNotifications', e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Processing complete</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Notify when transcript extraction is complete</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.notifications.processingComplete}
                    onChange={(e) => updateSettings('notifications', 'processingComplete', e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly digest</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weekly summary of your activity</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.notifications.weeklyDigest}
                    onChange={(e) => updateSettings('notifications', 'weeklyDigest', e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Product updates</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">News about new features and improvements</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.notifications.productUpdates}
                    onChange={(e) => updateSettings('notifications', 'productUpdates', e.target.checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && settings && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Privacy & Data</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Public profile</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to others</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.privacy.publicProfile}
                    onChange={(e) => updateSettings('privacy', 'publicProfile', e.target.checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data retention period
                  </label>
                  <select
                    className="input"
                    value={settings.privacy.dataRetention}
                    onChange={(e) => updateSettings('privacy', 'dataRetention', e.target.value)}
                  >
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="90d">90 days (Pro Only)</option>
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    How long to keep your transcript data
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Opt out of analytics</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Disable anonymous usage analytics</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.privacy.analyticsOptOut}
                    onChange={(e) => updateSettings('privacy', 'analyticsOptOut', e.target.checked)}
                  />
                </div>

                {/* Data Export */}
                <div className="border-t dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Data Export</h4>
                  <div className="space-y-3">
                    <button className="btn-secondary text-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download my data
                    </button>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Export all your data in a portable format
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">Security</h3>
              
              <div className="space-y-6">
                {/* Password */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Password</h4>
                  <button className="btn-secondary">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Last changed 3 months ago
                  </p>
                </div>

                {/* API Keys */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">API Keys</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm">yt_sk_****************************</span>
                      <button className="btn-ghost text-sm text-red-600 hover:text-red-700">
                        Revoke
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created on Aug 1, 2024 • Last used yesterday
                    </p>
                  </div>
                  <button className="btn-secondary mt-3">
                    Generate New API Key
                  </button>
                </div>

                {/* Account Deletion */}
                <div className="border-t dark:border-gray-700 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Danger Zone
                  </h4>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 dark:text-red-300 mb-2">Delete Account</h5>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}