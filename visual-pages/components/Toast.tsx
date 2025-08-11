'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
 id: string;
 type: ToastType;
 title: string;
 message?: string;
 duration?: number;
}

interface ToastProps {
 toast: ToastMessage;
 onDismiss: (id: string) => void;
}

const icons = {
 success: CheckCircle,
 error: AlertCircle,
 warning: AlertTriangle,
 info: Info,
};

const colors = {
 success: 'bg-green-50 border-green-200 text-green-800',
 error: 'bg-red-50 border-red-200 text-red-800',
 warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
 info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
 success: 'text-green-600',
 error: 'text-red-600',
 warning: 'text-yellow-600',
 info: 'text-blue-600',
};

export function Toast({ toast, onDismiss }: ToastProps) {
 const [isExiting, setIsExiting] = useState(false);
 const Icon = icons[toast.type];

 const handleDismiss = useCallback(() => {
  setIsExiting(true);
  setTimeout(() => {
   onDismiss(toast.id);
  }, 300);
 }, [toast.id, onDismiss]);

 useEffect(() => {
  if (toast.duration && toast.duration > 0) {
   const timer = setTimeout(() => {
    handleDismiss();
   }, toast.duration);

   return () => clearTimeout(timer);
  }
 }, [toast.duration, handleDismiss]);

 return (
  <div
   className={`
    ${colors[toast.type]}
    border rounded-lg shadow-lg p-4 mb-3 flex items-start gap-3
    transition-all duration-300 transform
    ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
    animate-slide-in-right
   `}
  >
   <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
   
   <div className="flex-1">
    <h4 className="font-semibold">{toast.title}</h4>
    {toast.message && (
     <p className="text-sm mt-1 opacity-90">{toast.message}</p>
    )}
   </div>
   
   <button
    onClick={handleDismiss}
    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
   >
    <X className="w-4 h-4" />
   </button>
  </div>
 );
}

interface ToastContainerProps {
 toasts: ToastMessage[];
 onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
 return (
  <div className="fixed top-4 right-4 z-50 max-w-sm w-full pointer-events-none">
   <div className="pointer-events-auto">
    {toasts.map((toast) => (
     <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
    ))}
   </div>
  </div>
 );
}