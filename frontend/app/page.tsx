'use client';

import { useState } from 'react';
import TranscriptExtractor from '@/components/TranscriptExtractor';
import MobileMenu from '@/components/MobileMenu';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Video, Zap, Globe, FileText, Bot, BarChart3, Cloud, ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function Home() {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const { user } = useAuth();
 const router = useRouter();

 const toggleMobileMenu = () => {
  setIsMobileMenuOpen(!isMobileMenuOpen);
 };

 const handleUpgrade = () => {
  if (!user) {
   // Redirect to signup if not logged in
   window.location.href = '/signup';
   return;
  }
  // Redirect to pricing page for upgrade
  window.location.href = '/pricing';
 };

 const scrollToExtractor = () => {
  const extractorElement = document.getElementById('transcript-extractor');
  if (extractorElement) {
   extractorElement.scrollIntoView({ behavior: 'smooth' });
  }
 };
 return (
  <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
   {/* Header */}
   <header className="glass-effect sticky top-0 z-50 border-b border-gray-200/20">
    <div className="container-main py-4">
     <div className="flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3 group">
       <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
        <Video className="w-5 h-5 text-white" />
       </div>
       <h1 className="text-2xl font-bold gradient-text">YTScript</h1>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
       <a href="#features" className="btn-ghost">Features</a>
       <a href="#pricing" className="btn-ghost">Pricing</a>
       {user ? (
        <>
         {user && <a href="/dashboard" className="btn-ghost">Dashboard</a>}
         <button onClick={() => router.push('/dashboard')} className="btn-primary">
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-1" />
         </button>
        </>
       ) : (
        <>
         <Link href="/login" className="btn-ghost">Login</Link>
         <Link href="/signup" className="btn-primary flex items-center gap-1">
          Sign Up Free
          <ArrowRight className="w-4 h-4" />
         </Link>
        </>
       )}
      </nav>
      <div className="flex items-center gap-4 md:hidden">
       <MobileMenu isOpen={isMobileMenuOpen} onToggle={toggleMobileMenu} />
      </div>
     </div>
    </div>
   </header>

   {/* Hero Section */}
   <section className="section relative overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
    
    <div className="container-main relative">
     <div className="text-center max-w-4xl mx-auto animate-fade-in">
      {/* Trust Badge */}
      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-6">
       <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
         <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
        ))}
       </div>
       <span className="text-sm font-medium text-gray-700">
        Trusted by 10,000+ creators
       </span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
       Transform YouTube Videos into
       <span className="gradient-text block mt-2">Actionable Content</span>
      </h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
       Extract transcripts, generate AI-powered summaries, and export in any format. 
       <strong className="text-gray-900"> Free forever</strong> for single videos.
      </p>

      {/* CTA Button */}
      <div className="flex justify-center mb-12">
       <button onClick={scrollToExtractor} className="btn-gradient text-lg px-8 py-4 electric-glow">
        <Zap className="w-5 h-5 mr-2" />
        Start Extracting - Free
       </button>
      </div>

      {/* Social Proof */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
       <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        No registration required
       </div>
       <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        Process unlimited videos
       </div>
       <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        AI-powered summaries
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Main Extractor */}
   <section id="transcript-extractor" className="pb-20 relative">
    <div className="container-main">
     <TranscriptExtractor />
    </div>
   </section>

   {/* Features Section - Bento Grid */}
   <section id="features" className="section bg-white">
    <div className="container-main">
     <div className="text-center mb-16 animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
       Everything you need to <span className="gradient-text">extract & analyze</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
       Powerful features designed for content creators, researchers, and professionals
      </p>
     </div>

     {/* Bento Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Instant Extraction - Large Feature */}
      <div className="lg:col-span-2 card-hover p-8 bg-gradient-to-br from-electric-50 to-blue-50 border-electric-200">
       <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-electric-600 rounded-xl flex items-center justify-center flex-shrink-0">
         <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
         <h3 className="text-xl font-bold text-gray-900 mb-3">
          Lightning Fast Extraction
         </h3>
         <p className="text-gray-600 mb-4 leading-relaxed">
          Get transcripts from any YouTube video in seconds. Our advanced processing pipeline 
          handles videos of any length with 99.9% accuracy.
         </p>
         <div className="flex items-center gap-4 text-sm text-electric-600">
          <span className="flex items-center gap-1">
           <CheckCircle className="w-4 h-4" />
           Sub-10 second processing
          </span>
          <span className="flex items-center gap-1">
           <CheckCircle className="w-4 h-4" />
           99.9% accuracy
          </span>
         </div>
        </div>
       </div>
      </div>

      {/* AI Summaries */}
      <div className="card-hover p-6 bg-gradient-to-br from-neon-purple/10 to-pink-100">
       <div className="w-10 h-10 bg-neon-purple rounded-lg flex items-center justify-center mb-4">
        <Bot className="w-5 h-5 text-white" />
       </div>
       <h3 className="text-lg font-bold text-gray-900 mb-2">
        AI Summaries
       </h3>
       <p className="text-gray-600 text-sm mb-3">
        GPT-4 powered summaries with key points and insights
       </p>
       <div className="text-xs text-neon-purple font-semibold">PRO FEATURE</div>
      </div>

      {/* Multi-Language */}
      <div className="card-hover p-6">
       <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-4">
        <Globe className="w-5 h-5 text-white" />
       </div>
       <h3 className="text-lg font-bold text-gray-900 mb-2">
        Multi-Language
       </h3>
       <p className="text-gray-600 text-sm">
        Support for 10+ languages including English, Japanese, Spanish, French
       </p>
      </div>

      {/* Multiple Formats */}
      <div className="card-hover p-6">
       <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
        <FileText className="w-5 h-5 text-white" />
       </div>
       <h3 className="text-lg font-bold text-gray-900 mb-2">
        Multiple Formats
       </h3>
       <p className="text-gray-600 text-sm">
        Export to TXT, Markdown, PDF, Word, Excel, and SRT
       </p>
      </div>

      {/* Batch Processing - Large Feature */}
      <div className="lg:col-span-2 card-hover p-6 bg-gradient-to-r from-orange-50 to-red-50">
       <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
         <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
         <h3 className="text-lg font-bold text-gray-900 mb-2">
          Batch Processing
         </h3>
         <p className="text-gray-600 text-sm mb-3">
          Process entire channels, playlists, and multiple videos simultaneously
         </p>
         <div className="text-xs text-orange-600 font-semibold">PRO FEATURE</div>
        </div>
       </div>
      </div>

      {/* Cloud Storage */}
      <div className="card-hover p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
       <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
        <Cloud className="w-5 h-5 text-white" />
       </div>
       <h3 className="text-lg font-bold text-gray-900 mb-2">
        Cloud Storage
       </h3>
       <p className="text-gray-600 text-sm mb-3">
        90-day storage with search and organization
       </p>
       <div className="text-xs text-purple-600 font-semibold">PRO FEATURE</div>
      </div>
     </div>

     {/* Stats */}
     <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      <div className="text-center">
       <div className="text-3xl font-bold gradient-text mb-2">10,000+</div>
       <div className="text-sm text-gray-600">Videos Processed</div>
      </div>
      <div className="text-center">
       <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
       <div className="text-sm text-gray-600">Accuracy Rate</div>
      </div>
      <div className="text-center">
       <div className="text-3xl font-bold gradient-text mb-2">5M+</div>
       <div className="text-sm text-gray-600">Words Extracted</div>
      </div>
      <div className="text-center">
       <div className="text-3xl font-bold gradient-text mb-2">85%</div>
       <div className="text-sm text-gray-600">Time Saved</div>
      </div>
     </div>
    </div>
   </section>

   {/* Pricing Section */}
   <section id="pricing" className="section bg-gray-50">
    <div className="container-main">
     <div className="text-center mb-16 animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
       Simple, <span className="gradient-text">transparent pricing</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
       Start for free, upgrade when you need more power. No hidden fees, cancel anytime.
      </p>
     </div>

     <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {/* Free Plan */}
      <div className="card p-8 relative">
       <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
         <h3 className="text-2xl font-bold text-gray-900">Free</h3>
         <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          Most Popular
         </div>
        </div>
        <div className="flex items-baseline gap-2">
         <span className="text-4xl font-bold text-gray-900">$0</span>
         <span className="text-gray-500">/month</span>
        </div>
        <p className="text-gray-600 mt-2">Perfect for individual creators</p>
       </div>
       
       <ul className="space-y-4 mb-8">
        <li className="flex items-start gap-3">
         <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
         <div>
          <span className="text-gray-900 font-medium">Unlimited single video extraction</span>
          <p className="text-sm text-gray-500">Process as many individual videos as you want</p>
         </div>
        </li>
        <li className="flex items-start gap-3">
         <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
         <div>
          <span className="text-gray-900 font-medium">TXT & Markdown export</span>
          <p className="text-sm text-gray-500">Download transcripts in basic formats</p>
         </div>
        </li>
        <li className="flex items-start gap-3">
         <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
         <div>
          <span className="text-gray-900 font-medium">No registration required</span>
          <p className="text-sm text-gray-500">Start using immediately</p>
         </div>
        </li>
        <li className="flex items-start gap-3">
         <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0"></div>
         <div>
          <span className="text-gray-500">Channel & playlist processing</span>
         </div>
        </li>
        <li className="flex items-start gap-3">
         <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0"></div>
         <div>
          <span className="text-gray-500">AI summaries</span>
         </div>
        </li>
       </ul>
       
       <button className="btn-secondary w-full">
        Current Plan
       </button>
      </div>

      {/* Pro Plan */}
      <div className="relative">
       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-cta text-white px-4 py-2 rounded-full text-sm font-bold shadow-electric">
         BEST VALUE
        </div>
       </div>
       <div className="card p-8 bg-gradient-to-br from-electric-50 to-purple-50 border-electric-200 electric-glow">
        <div className="mb-8">
         <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
         <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold gradient-text">$20</span>
          <span className="text-gray-500">/month</span>
         </div>
         <p className="text-gray-600 mt-2">For serious content creators</p>
        </div>
        
        <ul className="space-y-4 mb-8">
         <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
          <div>
           <span className="text-gray-900 font-medium">Everything in Free</span>
           <p className="text-sm text-gray-500">All free features included</p>
          </div>
         </li>
         <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
          <div>
           <span className="text-gray-900 font-medium">Unlimited channel & playlist processing</span>
           <p className="text-sm text-gray-500">Batch process entire channels</p>
          </div>
         </li>
         <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
          <div>
           <span className="text-gray-900 font-medium">AI-powered summaries (GPT-4)</span>
           <p className="text-sm text-gray-500">Get intelligent video summaries</p>
          </div>
         </li>
         <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
          <div>
           <span className="text-gray-900 font-medium">PDF, Word, Excel exports</span>
           <p className="text-sm text-gray-500">Professional format exports</p>
          </div>
         </li>
         <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
          <div>
           <span className="text-gray-900 font-medium">90-day cloud storage</span>
           <p className="text-sm text-gray-500">Access your transcripts anywhere</p>
          </div>
         </li>
         <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-electric-500 mt-0.5 flex-shrink-0" />
          <div>
           <span className="text-gray-900 font-medium">Priority processing</span>
           <p className="text-sm text-gray-500">Skip the queue</p>
          </div>
         </li>
        </ul>
        
        <button
         onClick={handleUpgrade}
         className="btn-gradient w-full mb-4"
        >
         Upgrade to Pro
         <ArrowRight className="w-4 h-4 ml-2" />
        </button>
        <p className="text-center text-sm text-gray-500">
         30-day money-back guarantee
        </p>
       </div>
      </div>
     </div>

     {/* Money back guarantee and testimonial */}
     <div className="mt-16 text-center">
      <div className="inline-flex items-center gap-2 text-sm text-gray-600">
       <CheckCircle className="w-4 h-4 text-green-500" />
       <span>30-day money-back guarantee</span>
       <span className="mx-2">•</span>
       <CheckCircle className="w-4 h-4 text-green-500" />
       <span>Cancel anytime</span>
       <span className="mx-2">•</span>
       <CheckCircle className="w-4 h-4 text-green-500" />
       <span>No hidden fees</span>
      </div>
     </div>
    </div>
   </section>

   {/* Footer */}
   <footer className="bg-gray-950 text-white">
    <div className="container-main">
     {/* Main Footer Content */}
     <div className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
       {/* Brand Section */}
       <div className="lg:col-span-2">
        <Link href="/" className="flex items-center gap-3 group mb-6">
         <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Video className="w-6 h-6 text-white" />
         </div>
         <h3 className="text-2xl font-bold gradient-text">YTScript</h3>
        </Link>
        <p className="text-gray-400 text-lg mb-6 max-w-md">
         Transform YouTube videos into actionable content with AI-powered transcript extraction and summarization.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
         <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>10,000+ videos processed</span>
         </div>
         <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>99.9% accuracy</span>
         </div>
        </div>
       </div>

       {/* Product Links */}
       <div>
        <h4 className="font-bold text-white mb-6">Product</h4>
        <ul className="space-y-4 text-gray-400">
         <li>
          <a href="#features" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
           Features
          </a>
         </li>
         <li>
          <a href="#pricing" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
           Pricing
          </a>
         </li>
         <li>
          <a href="/api" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
           API Docs
          </a>
         </li>
         <li>
          <a href="/changelog" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
           Changelog
          </a>
         </li>
        </ul>
       </div>

       {/* Support & Legal Links */}
       <div>
        <h4 className="font-bold text-white mb-6">Support & Legal</h4>
        <ul className="space-y-4 text-gray-400">
         <li>
          <a href="/terms" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
           Terms of Service
          </a>
         </li>
        </ul>
       </div>
      </div>
     </div>

     {/* Footer Bottom */}
     <div className="border-t border-gray-800 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
       <div className="text-gray-400 text-sm">
        © 2024 YTScript. All rights reserved.
       </div>
       <div className="flex items-center gap-6">
        <a href="/status" className="text-gray-400 hover:text-white text-sm transition-colors">
         Status
        </a>
        <div className="flex items-center gap-2 text-sm">
         <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
         <span className="text-gray-400">All systems operational</span>
        </div>
       </div>
      </div>
     </div>
    </div>
   </footer>
  </main>
 );
}
