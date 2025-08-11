# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YTScript is a Next.js application for extracting YouTube transcripts with AI-powered analysis. The project uses React with TypeScript for the frontend and includes features for transcript extraction, format conversion, and AI summaries.

## Project Structure

- `/visual-pages/` - Main Next.js application directory
  - `/app/` - Next.js app router pages (dashboard, login, signup, terms)
  - `/components/` - React components (TranscriptExtractor, Toast, ErrorBoundary, MobileMenu)

## Development Setup and Commands

Since there is no package.json in the root, development should be run from the `visual-pages` directory:

```bash
cd visual-pages
# Install dependencies (if package.json exists)
npm install
# Run development server
npm run dev
# or
next dev
```

## Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom gradient utilities
- **Authentication**: Context-based auth system with AuthContext
- **State Management**: React Context API (AuthContext, ToastContext)
- **UI Components**: Custom component library with glass effects and gradient styling

### Key Components

**TranscriptExtractor** (`components/TranscriptExtractor.tsx`):
- Main feature component handling YouTube URL input
- Multi-format export (TXT, SRT, JSON, PDF, DOCX, XLSX)
- Language selection support (10+ languages)
- AI summary integration (Pro feature)
- Premium vs free feature differentiation

**Context Providers**:
- `AuthContext`: User authentication and plan management
- `ToastContext`: Global notification system

### API Integration
- API endpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/extract`
- POST request with URL, language, formats, and summary options
- Handles both free and premium format responses

### Styling Patterns
- Glass morphism effects with backdrop blur
- Custom gradients (gradient-hero, gradient-cta, gradient-text)
- Electric glow effects for premium features
- Responsive design with mobile-first approach

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to http://localhost:5000)

## Key Features

- **Free Features**: Single video extraction, TXT/SRT/JSON export, multi-language support
- **Pro Features**: AI summaries (GPT-4), batch processing, PDF/DOCX/XLSX export, cloud storage

## Important Notes

- The project appears to be missing core configuration files (package.json, tsconfig.json, next.config.js)
- Context providers are referenced but their implementation files are not present
- The backend API service is expected to run on port 5000