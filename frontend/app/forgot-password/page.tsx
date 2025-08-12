'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showError('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        showSuccess('Email Sent', 'If an account exists with this email, you will receive password reset instructions.');
      } else {
        showError('Error', data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showError('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong> if an account exists with this email address.
            </p>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Didn't receive an email? Check your spam folder or try again with a different email address.
              </p>
              
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="btn-ghost w-full"
              >
                Try Another Email
              </button>
              
              <Link href="/login" className="btn-primary w-full inline-block text-center">
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/login" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input pl-10"
                  disabled={loading}
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Sending...
                </span>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}