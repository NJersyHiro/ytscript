'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Video, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignupPage() {
 const { signup } = useAuth();
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
 });
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [acceptedTerms, setAcceptedTerms] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validation
  if (formData.password !== formData.confirmPassword) {
   setError('Passwords do not match');
   setLoading(false);
   return;
  }

  if (formData.password.length < 6) {
   setError('Password must be at least 6 characters');
   setLoading(false);
   return;
  }

  if (!acceptedTerms) {
   setError('Please accept the Terms of Service and Privacy Policy');
   setLoading(false);
   return;
  }

  try {
   await signup(formData.name, formData.email, formData.password);
   // AuthProvider will handle the redirect to dashboard
  } catch (err) {
   setError((err as Error).message || 'Signup failed. Please try again.');
  } finally {
   setLoading(false);
  }
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
   ...formData,
   [e.target.name]: e.target.value
  });
 };

 const passwordStrength = (password: string) => {
  if (password.length === 0) return { strength: 0, label: '', color: '' };
  if (password.length < 6) return { strength: 1, label: 'Weak', color: 'text-red-500' };
  if (password.length < 8) return { strength: 2, label: 'Fair', color: 'text-yellow-500' };
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return { strength: 3, label: 'Strong', color: 'text-green-500' };
  return { strength: 2, label: 'Good', color: 'text-blue-500' };
 };

 const strength = passwordStrength(formData.password);

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
   {/* Background Effects */}
   <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
   <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
   <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>

   <div className="relative w-full max-w-md">
    {/* Header */}
    <div className="text-center mb-8">
     <Link href="/" className="inline-flex items-center gap-3 group mb-8">
      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
       <Video className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold gradient-text">YTScript</h1>
     </Link>
     
     <h2 className="text-3xl font-bold text-gray-900 mb-2">
      Create your account
     </h2>
     <p className="text-gray-600">
      Join thousands of creators extracting YouTube transcripts
     </p>
    </div>

    {/* Sign Up Form */}
    <div className="bg-white rounded-xl shadow-xl border border-gray-200/50 p-8">
     <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600">{error}</p>
       </div>
      )}

      {/* Name Field */}
      <div>
       <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
        Full name
       </label>
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <User className="h-5 w-5 text-gray-400" />
        </div>
        <input
         id="name"
         name="name"
         type="text"
         required
         className="input pl-10"
         placeholder="Enter your full name"
         value={formData.name}
         onChange={handleInputChange}
        />
       </div>
      </div>

      {/* Email Field */}
      <div>
       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
        Email address
       </label>
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
         id="email"
         name="email"
         type="email"
         required
         className="input pl-10"
         placeholder="Enter your email"
         value={formData.email}
         onChange={handleInputChange}
        />
       </div>
      </div>

      {/* Password Field */}
      <div>
       <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
        Password
       </label>
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
         id="password"
         name="password"
         type={showPassword ? 'text' : 'password'}
         required
         className="input pl-10 pr-10"
         placeholder="Create a password"
         value={formData.password}
         onChange={handleInputChange}
        />
        <button
         type="button"
         className="absolute inset-y-0 right-0 pr-3 flex items-center"
         onClick={() => setShowPassword(!showPassword)}
        >
         {showPassword ? (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
         ) : (
          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
         )}
        </button>
       </div>
       
       {/* Password Strength Indicator */}
       {formData.password && (
        <div className="mt-2">
         <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
           <div 
            className={`h-1 rounded-full transition-all duration-300 ${
             strength.strength === 1 ? 'w-1/4 bg-red-500' :
             strength.strength === 2 ? 'w-1/2 bg-yellow-500' :
             strength.strength === 3 ? 'w-full bg-green-500' :
             'w-0'
            }`}
           />
          </div>
          <span className={`text-xs font-medium ${strength.color}`}>
           {strength.label}
          </span>
         </div>
        </div>
       )}
      </div>

      {/* Confirm Password Field */}
      <div>
       <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
        Confirm password
       </label>
       <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
         id="confirmPassword"
         name="confirmPassword"
         type={showConfirmPassword ? 'text' : 'password'}
         required
         className={`input pl-10 pr-10 ${
          formData.confirmPassword && formData.password !== formData.confirmPassword 
           ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
           : ''
         }`}
         placeholder="Confirm your password"
         value={formData.confirmPassword}
         onChange={handleInputChange}
        />
        <button
         type="button"
         className="absolute inset-y-0 right-0 pr-3 flex items-center"
         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
         {showConfirmPassword ? (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
         ) : (
          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
         )}
        </button>
       </div>
       {formData.confirmPassword && formData.password !== formData.confirmPassword && (
        <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
       )}
      </div>

      {/* Terms and Privacy */}
      <div className="flex items-start">
       <input
        id="terms"
        type="checkbox"
        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
       />
       <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
        I agree to the{' '}
        <Link href="/terms" className="text-blue-600 hover:text-blue-700">
         Terms of Service
        </Link>
       </label>
      </div>

      {/* Submit Button */}
      <button
       type="submit"
       disabled={loading || !acceptedTerms}
       className={`btn-gradient w-full ${(loading || !acceptedTerms) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
       {loading ? (
        <>
         <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
         Creating account...
        </>
       ) : (
        <>
         Create account
         <ArrowRight className="w-4 h-4 ml-2" />
        </>
       )}
      </button>
     </form>

     {/* Divider */}
     <div className="mt-6">
      <div className="relative">
       <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
       </div>
       <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">Or continue with</span>
       </div>
      </div>
     </div>

     {/* Social Login */}
     <div className="mt-6">
      <button className="w-full btn-secondary">
       <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
       </svg>
       Continue with Google
      </button>
     </div>

     {/* Sign In Link */}
     <p className="mt-6 text-center text-sm text-gray-600">
      Already have an account?{' '}
      <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
       Sign in
      </Link>
     </p>
    </div>

    {/* Features Preview */}
    <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
     <h3 className="text-sm font-semibold text-gray-900 mb-4">What you get with YTScript:</h3>
     <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="flex items-center gap-2">
       <CheckCircle className="w-3 h-3 text-green-500" />
       <span className="text-gray-600">Unlimited extractions</span>
      </div>
      <div className="flex items-center gap-2">
       <CheckCircle className="w-3 h-3 text-green-500" />
       <span className="text-gray-600">Multiple formats</span>
      </div>
      <div className="flex items-center gap-2">
       <CheckCircle className="w-3 h-3 text-green-500" />
       <span className="text-gray-600">History tracking</span>
      </div>
      <div className="flex items-center gap-2">
       <CheckCircle className="w-3 h-3 text-green-500" />
       <span className="text-gray-600">Free forever</span>
      </div>
     </div>
    </div>

    {/* Footer */}
    <div className="mt-8 text-center">
     <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
      <Link href="/terms" className="hover:text-gray-700">Terms</Link>
     </div>
    </div>
   </div>
  </div>
 );
}