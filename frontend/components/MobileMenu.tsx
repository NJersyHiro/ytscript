'use client';

import Link from 'next/link';
import { X, Menu, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
 isOpen: boolean;
 onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
 const { user } = useAuth();
 return (
  <>
   {/* Mobile menu button */}
   <button 
    onClick={onToggle}
    className="md:hidden btn-ghost p-2"
    aria-label="Toggle menu"
   >
    {isOpen ? (
     <X className="w-6 h-6" />
    ) : (
     <Menu className="w-6 h-6" />
    )}
   </button>

   {/* Mobile menu overlay */}
   {isOpen && (
    <div className="fixed inset-0 z-50 md:hidden">
     {/* Backdrop */}
     <div 
      className="fixed inset-0 bg-black bg-opacity-50"
      onClick={onToggle}
     />
     
     {/* Menu panel */}
     <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
       {/* Header */}
       <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold gradient-text">YTScript</h2>
        <button 
         onClick={onToggle}
         className="p-2 rounded-lg hover:bg-gray-100"
         aria-label="Close menu"
        >
         <X className="w-5 h-5" />
        </button>
       </div>

       {/* Navigation */}
       <nav className="flex-1 p-6">
        <ul className="space-y-4">
         <li>
          <a 
           href="#features" 
           onClick={onToggle}
           className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
           Features
          </a>
         </li>
         <li>
          <a 
           href="#pricing" 
           onClick={onToggle}
           className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
           Pricing
          </a>
         </li>
         {user && (
          <li>
           <Link 
            href="/dashboard" 
            onClick={onToggle}
            className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
           >
            Dashboard
           </Link>
          </li>
         )}
        </ul>
       </nav>

       {/* CTA Buttons */}
       <div className="p-6 border-t border-gray-200 space-y-3">
        {user ? (
         <Link 
          href="/dashboard"
          onClick={onToggle}
          className="btn-primary w-full text-center block"
         >
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-2 inline" />
         </Link>
        ) : (
         <>
          <Link 
           href="/login"
           onClick={onToggle}
           className="btn-secondary w-full text-center block"
          >
           Login
          </Link>
          <Link 
           href="/signup"
           onClick={onToggle}
           className="btn-primary w-full text-center block"
          >
           Sign Up Free
           <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Link>
         </>
        )}
       </div>
      </div>
     </div>
    </div>
   )}
  </>
 );
}