'use client';

import { useToast } from '@/contexts/ToastContext';

export default function ToastDemoPage() {
  const { showSuccess, showError, showWarning, showInfo, showToast } = useToast();

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Toast Notification Demo
        </h1>
        <p className="text-gray-600 mb-8">Test all toast notification variants and features</p>

        <div className="space-y-8">
          {/* Basic Toast Types */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Basic Toast Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => showSuccess('Success!', 'Your action was completed successfully.')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Success Toast
              </button>
              <button
                onClick={() => showError('Error!', 'Something went wrong. Please try again.')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Error Toast
              </button>
              <button
                onClick={() => showWarning('Warning!', 'Please review your input before proceeding.')}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Warning Toast
              </button>
              <button
                onClick={() => showInfo('Info', 'Here is some useful information for you.')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Info Toast
              </button>
            </div>
          </section>

          {/* Custom Duration */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Duration</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => showToast('info', 'Quick Toast', 'Disappears in 2 seconds', 2000)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                2 Second Toast
              </button>
              <button
                onClick={() => showToast('success', 'Normal Toast', 'Default 5 seconds duration', 5000)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                5 Second Toast
              </button>
              <button
                onClick={() => showToast('warning', 'Long Toast', 'Stays for 10 seconds', 10000)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                10 Second Toast
              </button>
            </div>
          </section>

          {/* Stacking Test */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Stacking & Queue</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  showSuccess('First Toast', 'This appears first');
                  setTimeout(() => showInfo('Second Toast', 'This stacks on top'), 500);
                  setTimeout(() => showWarning('Third Toast', 'This is the newest'), 1000);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Show 3 Stacked Toasts
              </button>
              <button
                onClick={() => {
                  for (let i = 1; i <= 5; i++) {
                    setTimeout(() => {
                      const types = ['success', 'error', 'warning', 'info'] as const;
                      const type = types[Math.floor(Math.random() * types.length)];
                      showToast(type, `Toast #${i}`, `This is toast number ${i}`);
                    }, i * 300);
                  }
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Rapid Fire (5 Toasts)
              </button>
            </div>
          </section>

          {/* Real-world Examples */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Real-world Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => showSuccess('Transcript Extracted', 'Your YouTube transcript has been successfully extracted.')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                Extraction Success
              </button>
              <button
                onClick={() => showError('Invalid URL', 'Please enter a valid YouTube URL.')}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors"
              >
                Validation Error
              </button>
              <button
                onClick={() => showWarning('Pro Feature', 'Upgrade to Pro to access AI summaries.')}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors"
              >
                Upgrade Warning
              </button>
              <button
                onClick={() => showInfo('Processing', 'Your request is being processed...')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                Processing Info
              </button>
            </div>
          </section>

          {/* Edge Cases */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Edge Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => showInfo('Short', undefined)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Title Only (No Message)
              </button>
              <button
                onClick={() => showWarning(
                  'Very Long Title That Should Still Display Properly Without Breaking The Layout',
                  'This is a very long message that contains a lot of text to test how the toast component handles lengthy content without breaking the layout or causing overflow issues in the notification area.'
                )}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Long Content
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}