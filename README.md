# YTScript - YouTube Transcript Extractor 🎥

Extract, convert, and analyze YouTube transcripts with AI-powered summaries. Built with Next.js 14, TypeScript, and Tailwind CSS.

![YTScript Homepage](./VISUAL_OVERVIEW.md)

## ✨ Features

### Free Plan
- 🔥 **Unlimited single video extraction** - Process as many videos as you want
- 📝 **Multiple export formats** - TXT, SRT, JSON
- 🌍 **Multi-language support** - 10+ languages including English, Japanese, Spanish, French
- 🚀 **Lightning fast** - Sub-10 second processing with 99.9% accuracy
- 🆓 **No registration required** - Start using immediately

### Pro Plan ($20/month)
- ✅ Everything in Free plan
- 🤖 **AI-powered summaries** - GPT-4 powered intelligent video summaries
- 📊 **Batch processing** - Process entire channels and playlists
- 📄 **Premium formats** - PDF, DOCX, XLSX exports
- ☁️ **Cloud storage** - 90-day transcript storage with search
- ⚡ **Priority processing** - Skip the queue

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NJersyHiro/ytscript.git
cd ytscript
```

2. Navigate to the app directory:
```bash
cd visual-pages
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Authentication**: Google OAuth integration
- **Icons**: Lucide React
- **Fonts**: Inter & JetBrains Mono

## 📁 Project Structure

```
ytscript/
├── visual-pages/           # Next.js application
│   ├── app/               # App router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── login/        # Authentication
│   │   ├── signup/       # User registration
│   │   ├── dashboard/    # User dashboard
│   │   ├── pricing/      # Pricing plans
│   │   └── ...
│   ├── components/        # Reusable components
│   │   ├── TranscriptExtractor.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   └── lib/              # Utilities
└── README.md
```

## 🎨 Features Overview

### Homepage
- Hero section with gradient animations
- Main transcript extractor widget
- Feature showcase with bento grid layout
- Pricing comparison
- Trust indicators and social proof

### Authentication
- Email/password login
- Google OAuth integration
- Secure session management
- Protected routes

### Dashboard
- Usage statistics
- Recent extraction history
- Subscription management
- User settings

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Key Components

- **TranscriptExtractor**: Main extraction interface with format selection
- **AuthContext**: Authentication state management
- **ThemeContext**: Dark/light mode support
- **ToastContext**: Notification system

## 🚢 Deployment

The app can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## 📝 API Integration

The frontend expects a backend API at `NEXT_PUBLIC_API_URL` with the following endpoints:

- `/api/extract` - Extract transcript from YouTube URL
- `/api/auth/login` - User authentication
- `/api/auth/register` - User registration
- `/api/auth/logout` - Logout
- `/api/profile` - User profile
- `/api/subscription` - Subscription management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Live Demo**: Coming soon!

**Repository**: [https://github.com/NJersyHiro/ytscript](https://github.com/NJersyHiro/ytscript)