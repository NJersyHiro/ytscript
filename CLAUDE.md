# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YTScript is a YouTube transcript extractor and AI analyzer web application built with Next.js. It allows users to extract transcripts from YouTube videos, convert them to multiple formats, and generate AI-powered summaries using GPT-4.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14+ with App Router, React, TypeScript
- **Styling**: Tailwind CSS with custom theme and dark mode support
- **Fonts**: Inter and JetBrains Mono from Google Fonts
- **State Management**: React Context API for authentication, theme, and toast notifications

### Project Structure
```
visual-pages/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page with TranscriptExtractor
│   ├── dashboard/         # Protected user dashboard
│   ├── login/             # Authentication page
│   ├── signup/            # User registration
│   ├── extract/           # Transcript extraction page
│   ├── batch/             # Batch processing page
│   ├── billing/           # Subscription management
│   └── ...
├── components/            # Reusable React components
│   ├── TranscriptExtractor.tsx  # Main extraction interface
│   ├── ThemeToggle.tsx          # Dark/light mode toggle
│   └── ...
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state & logic
│   ├── ThemeContext.tsx   # Theme management
│   └── ToastContext.tsx   # Toast notifications
└── globals.css            # Global styles & Tailwind imports
```

### Core Components

**TranscriptExtractor**: Main component handling video transcript extraction with support for multiple formats (TXT, SRT, JSON, PDF, DOCX, XLSX) and AI summaries.

**AuthContext**: Manages authentication state, protected routes, token refresh, and user session. Protected routes include `/dashboard`, `/extract`, `/history`, `/billing`, `/settings`.

**API Integration**: The app expects an API backend at `process.env.NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`) with endpoints for:
- `/api/extract` - Extract transcript from YouTube URL
- Authentication endpoints (login, register, logout, profile, refresh)
- Stripe integration for Pro subscriptions

## Development Commands

Since there's no package.json in the current directory, you'll need to navigate to the visual-pages directory and set up the project:

```bash
cd visual-pages

# Install dependencies (assuming npm/yarn is used)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Key Features & User Plans

### Free Plan
- Unlimited single video extraction
- TXT, Markdown, SRT, JSON export formats
- No registration required

### Pro Plan ($20/month)
- Everything in Free plan
- Channel & playlist batch processing
- AI-powered summaries with GPT-4
- Premium export formats (PDF, DOCX, XLSX)
- 90-day cloud storage
- Priority processing

## Important Notes

- The app uses absolute imports with `@/` prefix for components, contexts, lib, and hooks
- Protected routes automatically redirect to `/login` if not authenticated
- The app includes Stripe integration for Pro subscriptions via custom `useStripe` hook
- Dark mode is implemented using Tailwind's `dark:` class variants
- All API calls should handle both success and error responses using the `isApiError` utility
- The app expects certain API services (`@/lib/api` and `@/hooks/useStripe`) that are not present in the current codebase - these would need to be implemented

## Missing Dependencies

The following modules are imported but not present in the codebase and need to be implemented:
- `@/lib/api` - API service module with methods like `login`, `register`, `logout`, `getProfile`, `refreshToken`
- `@/hooks/useStripe` - Stripe integration hook for payment processing