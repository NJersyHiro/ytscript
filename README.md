# YTScript - YouTube Transcript Extractor & AI Analyzer

A Next.js web application that extracts transcripts from YouTube videos, provides AI-powered summaries, and exports in multiple formats.

## 🚀 Features

- **YouTube Transcript Extraction**: Extract transcripts from any YouTube video instantly
- **Multi-Language Support**: Support for 10+ languages including English, Japanese, Spanish, French
- **Multiple Export Formats**: Export to TXT, SRT, JSON, PDF, DOCX, XLSX
- **AI-Powered Summaries**: Generate intelligent summaries using GPT-4 (Pro feature)
- **Batch Processing**: Process entire channels and playlists (Pro feature)
- **Cloud Storage**: 90-day storage with search and organization (Pro feature)

## 📦 Tech Stack

- **Frontend**: Next.js 14.2.5, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Context API, Zustand
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe integration
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library, MSW

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ytscript.git
cd ytscript/visual-pages
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Development Status

### ✅ Phase 1: Foundation Setup (COMPLETED)
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up environment variables
- [x] Create context providers (AuthContext, ToastContext)
- [x] Fix layout and navigation
- [x] Development server running successfully

### 🔄 Phase 2: Core Features (IN PROGRESS)
- [ ] Set up API mocking with MSW
- [ ] Enhance TranscriptExtractor component
- [ ] Implement results display
- [ ] Add loading states and error handling

### 📋 Upcoming Phases
- Phase 3: Authentication System
- Phase 4: Landing Page & UI Polish
- Phase 5: Dashboard & User Features
- Phase 6: Pro Features & Payments
- Phase 7: Quality, Testing & Deployment

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests in watch mode
- `npm run test:ci` - Run tests in CI mode

## 📁 Project Structure

```
visual-pages/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout with providers
│   ├── page.tsx        # Homepage
│   ├── globals.css     # Global styles
│   └── dashboard/      # Dashboard route
├── components/          # React components
│   ├── TranscriptExtractor.tsx
│   ├── Toast.tsx
│   ├── ErrorBoundary.tsx
│   └── MobileMenu.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── lib/                # Utility functions
├── types/              # TypeScript types
└── public/             # Static assets
```

## 🚦 API Endpoints

The frontend expects a backend API at `http://localhost:5000` with the following endpoints:

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password`

### Core Features
- POST `/api/extract` - Extract single video transcript
- POST `/api/extract/batch` - Batch process videos

### User Management
- GET/PUT `/api/user/profile`
- GET `/api/user/stats`

### Subscription
- GET `/api/subscription`
- POST `/api/subscription/upgrade`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Linear Project Board](https://linear.app/ytscript)
- [API Documentation](./docs/API.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN_V2.md)

---

**Current Development Phase**: Phase 2 - Core Features Implementation