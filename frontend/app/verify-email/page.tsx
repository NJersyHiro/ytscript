'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerifying(false);
      if (user?.email) {
        setResendEmail(user.email);
      }
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-email/${token}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setVerified(true);
        showSuccess('Success', 'Your email has been verified successfully!');
      } else {
        setError(data.error || 'Failed to verify email');
        showError('Verification Failed', data.error || 'Invalid or expired verification link');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError('Failed to verify email. Please try again.');
      showError('Error', 'Failed to verify email');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail.trim()) {
      showError('Error', 'Please enter your email address');
      return;
    }
    
    setResending(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: resendEmail.trim() }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        showSuccess('Email Sent', 'If an account exists with this email, a new verification link has been sent.');
      } else {
        showError('Error', data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      showError('Error', 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  // Verifying state
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="card p-8 text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying your email address...</p>
        </div>
      </div>
    );
  }

  // Successfully verified
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now access all features of YTScript.
            </p>
            
            <div className="space-y-3">
              <Link href="/dashboard" className="btn-gradient w-full inline-block text-center">
                Go to Dashboard
              </Link>
              
              <Link href="/login" className="btn-ghost w-full inline-block text-center">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or resend verification state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Verification Failed
              </h2>
              
              <p className="text-gray-600 mb-6 text-center">
                {error}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Verify Your Email
              </h2>
              
              <p className="text-gray-600 mb-6 text-center">
                Enter your email address to receive a new verification link.
              </p>
            </>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                disabled={resending}
              />
            </div>
            
            <button
              onClick={handleResendVerification}
              disabled={resending || !resendEmail.trim()}
              className="btn-gradient w-full"
            >
              {resending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Resend Verification Email
                </span>
              )}
            </button>
            
            <div className="text-center space-y-2">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800 block">
                Back to Login
              </Link>
              
              {user && (
                <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 block">
                  Continue to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}