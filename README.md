# YTScript - YouTube Transcript Extractor & AI Analyzer

A full-stack web application that extracts transcripts from YouTube videos, provides AI-powered summaries, and exports in multiple formats.

## Features

**Free**
- YouTube transcript extraction from any video
- Multi-language support (10+ languages)
- Export to TXT, SRT, JSON

**Pro**
- AI-powered summaries (OpenAI GPT-4)
- Batch processing for channels and playlists
- Export to PDF, DOCX, XLSX
- 90-day cloud storage with search

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Express.js 5, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | NextAuth.js (Google OAuth), JWT |
| Payments | Stripe |
| AI | OpenAI API |
| Transcript | yt-dlp |

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- PostgreSQL
- yt-dlp (installed globally or in backend/)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ytscript.git
cd ytscript
```

2. Set up the backend:
```bash
cd backend
npm install
cp .env.example .env   # Edit with your credentials
npx prisma generate
npx prisma migrate dev
npm run dev
```

3. Set up the frontend:
```bash
cd frontend
npm install
cp .env.example .env.local   # Edit with your API URL
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ytscript/
├── frontend/              # Next.js frontend
│   ├── app/               # App Router pages
│   │   ├── api/auth/      # NextAuth routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── login/         # Login page
│   │   ├── signup/        # Registration
│   │   ├── pricing/       # Pricing page
│   │   └── ...
│   ├── components/        # React components
│   ├── contexts/          # Auth & Toast contexts
│   └── lib/               # Utilities
├── backend/               # Express.js API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helpers
│   └── prisma/            # DB schema & migrations
└── hooks/                 # Claude Code hooks
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Transcript Extraction
- `POST /api/extract` - Extract single video transcript
- `POST /api/extract/batch` - Batch extraction (Pro)

### Subscription
- `GET /api/subscription` - Get subscription status
- `POST /api/subscription/upgrade` - Upgrade to Pro

### Health
- `GET /api/health` - API health check

## Available Scripts

### Frontend (`cd frontend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript checking |
| `npm run test` | Run tests |

### Backend (`cd backend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5000) |
| `npm run build` | Compile TypeScript |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT
