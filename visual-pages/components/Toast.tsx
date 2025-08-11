'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
 type: ToastType;
 title: string;
 message?: string;
 onClose: () => void;
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

export default function Toast({ type, title, message, onClose }: ToastProps) {
 const [isExiting, setIsExiting] = useState(false);
 const Icon = icons[type];

 const handleClose = () => {
  setIsExiting(true);
  setTimeout(() => {
   onClose();
  }, 300);
 };

 useEffect(() => {
  const timer = setTimeout(() => {
   handleClose();
  }, 5000);

  return () => clearTimeout(timer);
 }, []);

 return (
  <div
   className={`
    ${colors[type]}
    border rounded-lg shadow-lg p-4 mb-3 flex items-start gap-3
    transition-all duration-300 transform min-w-[320px]
    ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
   `}
  >
   <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
   
   <div className="flex-1">
    <h4 className="font-semibold">{title}</h4>
    {message && (
     <p className="text-sm mt-1 opacity-90">{message}</p>
    )}
   </div>
   
   <button
    onClick={handleClose}
    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
   >
    <X className="w-4 h-4" />
   </button>
  </div>
 );
}