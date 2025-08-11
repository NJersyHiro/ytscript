'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
// import AuthSessionProvider from '@/components/SessionProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only enable MSW in development
    if (process.env.NODE_ENV === 'development') {
      // Check if we should enable mocking
      const enableMocking = process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true';
      
      if (enableMocking) {
        import('../mocks/browser').then(({ worker }) => {
          worker.start({
            onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
          }).then(() => {
            console.log('🔧 MSW Started - API mocking enabled');
            setIsReady(true);
          });
        });
      } else {
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <ToastProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}