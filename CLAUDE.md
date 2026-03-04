# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YTScript is a full-stack application for extracting YouTube transcripts with AI-powered analysis. It uses a monorepo structure with separate frontend and backend directories.

## Project Structure

```
ytscript/
├── frontend/          # Next.js 14 frontend (React, TypeScript, Tailwind CSS)
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   ├── contexts/      # React context providers (Auth, Toast)
│   ├── lib/           # Utility functions
│   ├── mocks/         # MSW mock handlers
│   ├── types/         # TypeScript type definitions
│   └── public/        # Static assets
├── backend/           # Express.js backend (TypeScript, Prisma)
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/     # Auth, error handling, validation
│   │   ├── routes/        # API route definitions
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Database config
│   │   └── server.ts      # Entry point
│   └── prisma/            # Database schema & migrations
└── hooks/             # Claude Code hooks
```

## Development Commands

### Frontend (from `/frontend`)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
npm run test         # Run tests (watch mode)
```

### Backend (from `/backend`)
```bash
npm install          # Install dependencies
npm run dev          # Start dev server with nodemon (port 5000)
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## Architecture

### Frontend
- **Framework**: Next.js 14.2.5 with App Router
- **Styling**: Tailwind CSS with glass morphism effects
- **Auth**: NextAuth.js with Google OAuth
- **State**: React Context (AuthContext, ToastContext) + Zustand
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe.js

### Backend
- **Framework**: Express.js 5 with TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT with bcryptjs
- **Payments**: Stripe
- **Email**: Nodemailer
- **Transcript**: yt-dlp for YouTube transcript extraction
- **AI**: OpenAI API for summaries

### API Integration
- Frontend API URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`)
- Main endpoint: `POST /api/extract` (URL, language, formats, summary options)

## Environment Variables

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend (`backend/.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing key
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` - Stripe keys
- `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` - Email config
- `OPENAI_API_KEY` - OpenAI API key

## Key Features

- **Free**: Single video extraction, TXT/SRT/JSON export, multi-language support
- **Pro**: AI summaries, batch processing, PDF/DOCX/XLSX export, cloud storage
