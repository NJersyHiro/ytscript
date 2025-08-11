'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiService, isApiError } from '@/lib/api';

interface User {
 id: string;
 name: string;
 email: string;
 plan: 'free' | 'pro';
 avatar?: string;
}

interface AuthContextType {
 user: User | null;
 loading: boolean;
 login: (email: string, password: string) => Promise<void>;
 signup: (name: string, email: string, password: string) => Promise<void>;
 logout: () => void;
 isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
 children: ReactNode;
}

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/extract', '/history', '/billing', '/settings'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/terms', '/privacy', '/contact', '/api', '/docs', '/status', '/changelog'];

export function AuthProvider({ children }: AuthProviderProps) {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);
 const router = useRouter();
 const pathname = usePathname();

 // Check if current route is protected
 const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
 const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));

 // Initialize auth state on component mount
 useEffect(() => {
  initializeAuth();
 }, []);

 // Handle route protection
 useEffect(() => {
  if (!loading) {
   if (isProtectedRoute && !user) {
    // Redirect to login if accessing protected route without authentication
    router.push('/login');
   } else if ((pathname === '/login' || pathname === '/signup') && user) {
    // Redirect to dashboard if already logged in and accessing auth pages
    router.push('/dashboard');
   }
  }
 }, [loading, user, pathname, isProtectedRoute, router]);

 const initializeAuth = async () => {
  try {
   const token = localStorage.getItem('auth_token');
   const refreshToken = localStorage.getItem('refresh_token');
   
   if (token) {
    // Validate token with the server
    const response = await apiService.getProfile();
    
    if (isApiError(response)) {
     // Token might be expired, try to refresh
     if (refreshToken) {
      const refreshResponse = await apiService.refreshToken(refreshToken);
      if (!isApiError(refreshResponse) && refreshResponse.data) {
       // Update tokens
       localStorage.setItem('auth_token', refreshResponse.data.access_token);
       
       // Try to get profile again
       const retryResponse = await apiService.getProfile();
       if (!isApiError(retryResponse) && retryResponse.data) {
        setUser({
         id: retryResponse.data.user.id,
         name: retryResponse.data.user.name,
         email: retryResponse.data.user.email,
         plan: retryResponse.data.user.subscription_status || 'free'
        });
       } else {
        // Failed to get profile, clear tokens
        clearAuthData();
       }
      } else {
       // Refresh failed, clear tokens
       clearAuthData();
      }
     } else {
      // No refresh token, clear auth data
      clearAuthData();
     }
    } else if (response.data) {
     // Token is valid, set user
     setUser({
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
      plan: response.data.user.subscription_status || 'free'
     });
    }
   }
  } catch (error) {
   console.error('Failed to initialize auth:', error);
   clearAuthData();
  } finally {
   setLoading(false);
  }
 };

 const clearAuthData = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  setUser(null);
 };

 const login = async (email: string, password: string) => {
  try {
   const response = await apiService.login(email, password);
   
   if (isApiError(response)) {
    throw new Error(response.error);
   }
   
   if (response.data) {
    const { user, access_token, refresh_token } = response.data;
    
    // Store auth data
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Set user state
    setUser({
     id: user.id,
     name: user.name,
     email: user.email,
     plan: user.subscription_status || 'free'
    });
   }
  } catch (error) {
   console.error('Login failed:', error);
   throw error;
  }
 };

 const signup = async (name: string, email: string, password: string) => {
  try {
   const response = await apiService.register(name, email, password);
   
   if (isApiError(response)) {
    throw new Error(response.error);
   }
   
   if (response.data) {
    const { user, access_token, refresh_token } = response.data;
    
    // Store auth data
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Set user state
    setUser({
     id: user.id,
     name: user.name,
     email: user.email,
     plan: user.subscription_status || 'free'
    });
   }
  } catch (error) {
   console.error('Signup failed:', error);
   throw error;
  }
 };

 const logout = async () => {
  try {
   // Call logout API
   await apiService.logout();
  } catch (error) {
   console.error('Logout API call failed:', error);
   // Continue with logout even if API call fails
  }
  
  // Clear auth data
  clearAuthData();
  
  // Redirect to home page
  router.push('/');
 };

 const value: AuthContextType = {
  user,
  loading,
  login,
  signup,
  logout,
  isAuthenticated: !!user
 };

 return (
  <AuthContext.Provider value={value}>
   {children}
  </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (context === undefined) {
  throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
}


// Loading component for protected routes
export function AuthGuard({ children }: { children: ReactNode }) {
 const { loading, user } = useAuth();
 const pathname = usePathname();
 const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

 // Show loading spinner while auth is initializing
 if (loading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
     <p className="text-gray-600">Authenticating...</p>
    </div>
   </div>
  );
 }

 // For protected routes, don't render anything if not authenticated
 // The AuthProvider useEffect will handle the redirect
 if (isProtectedRoute && !user) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
     <p className="text-gray-600">Redirecting to login...</p>
    </div>
   </div>
  );
 }

 return <>{children}</>;
}