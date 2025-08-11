import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YTScript - YouTube Transcript Extractor & AI Analyzer",
  description: "Extract, convert, and analyze YouTube transcripts with AI-powered summaries. Support for multiple formats including PDF, DOCX, and SRT.",
  keywords: "YouTube transcript, video to text, AI summary, subtitle extractor",
  openGraph: {
    title: "YTScript - YouTube Transcript Extractor",
    description: "Extract and analyze YouTube transcripts with AI",
    url: "https://ytscript.com",
    siteName: "YTScript",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}
      >
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ErrorBoundary>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow">
                    {children}
                  </main>
                </div>
              </ErrorBoundary>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
