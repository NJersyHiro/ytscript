'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      showError('Error', 'Invalid reset link');
      router.push('/forgot-password');
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password/validate/${token}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setTokenValid(true);
        setTokenEmail(data.data?.email || '');
      } else {
        showError('Invalid Token', data.error || 'This reset link is invalid or has expired');
        setTimeout(() => router.push('/forgot-password'), 3000);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      showError('Error', 'Failed to validate reset link');
      setTimeout(() => router.push('/forgot-password'), 3000);
    } finally {
      setValidating(false);
    }
  };

  const validatePassword = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        showSuccess('Success', 'Your password has been reset successfully');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        showError('Error', data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showError('Error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="card p-8 text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/forgot-password" className="btn-primary inline-block">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Link href="/login" className="btn-gradient inline-block">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h2>
          
          {tokenEmail && (
            <p className="text-sm text-gray-600 mb-6">
              Enter a new password for <strong>{tokenEmail}</strong>
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="Enter new password"
                  className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder="Confirm new password"
                  className={`input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Resetting Password...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Reset Password
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}