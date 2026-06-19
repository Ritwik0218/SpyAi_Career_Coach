<div align="center">

<img src="./public/logo.png" alt="SPY AI Career Coach" width="260" />

# SPY AI — Your AI Career Coach

**The all-in-one, free AI-powered platform to help you land your dream job.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

[🌐 **Live Demo**](https://spy-ai-alpha.vercel.app) · [📖 Documentation](#-features) · [🚀 Quick Start](#-quick-start) · [🤝 Contribute](#-contributing)

</div>

---

## ✨ Overview

**SPY AI** is a comprehensive, completely **free** AI-powered career coaching platform built for job seekers who want to work smarter. From resume building and ATS analysis to mock interviews, salary negotiation coaching, and LinkedIn optimization — SPY AI is your full-stack career command center.

> Built with **Next.js 15**, **Google Gemini AI**, and a focus on a premium, professional user experience.

---

## 🎯 Features

### 🧑‍💼 Profile & Career Management
- **Profile Settings** — Update your industry, specialization, years of experience, skills, and bio at any time.
- **Career Path Reset** — Switch careers completely and get re-onboarded with fresh industry insights.
- **Personalized Onboarding** — AI-calibrated experience from day one based on your career trajectory.

### 📄 Resume Tools
- **AI Resume Builder** — Live preview, rich formatting, and one-click PDF export.
- **ATS Analyzer** — Upload any resume (PDF, DOCX, TXT) and get a detailed ATS compatibility score, keyword gap analysis, and section-by-section fixes.
- **Tailored Resume Suggestions** — Match your resume to specific job descriptions for maximum impact.

### 🎤 Interview Preparation
- **Mock Interview System** — AI-driven quizzes with industry-specific questions and instant performance feedback.
- **Performance Tracking** — Charts and analytics to track progress over multiple sessions.
- **Salary Negotiator Coach** — Roleplay real HR negotiation conversations with AI and get script-ready rebuttals and strategy.

### 💼 Job Tracking
- **Kanban Job Board** — Track every application across stages: Saved → Applied → Interview → Offer → Rejected.
- **Follow-Up Reminders** — Set follow-up dates with urgency badges to never miss a window.
- **Job Details & Notes** — Store role details, salary, location, and application notes in one place.
- **AI Resume Tailoring** — One-click AI to adapt your resume content for a specific tracked job.

### 🔗 LinkedIn Optimizer
- **PDF-Based Analysis** — Export your LinkedIn profile as a PDF and upload it for a deep analysis.
- **Direct Actionable Feedback** — AI provides copy-pasteable rewrites for your headline, summary, and experience sections.
- **Visibility & SEO Tips** — Learn exactly which keywords and structural changes will boost your profile ranking.

### ✉️ Cover Letter Generator
- **Context-Aware AI** — Analyzes the job description and your resume to generate a hyper-relevant cover letter.
- **Fully Editable** — In-browser editor with markdown support and one-click copy.

### 🧑‍💻 Coding Interview Prep
- **150+ Curated Problems** — NeetCode-style problems organized by data structure and difficulty.
- **In-Browser Code Editor** — Write and submit solutions with real-time feedback.
- **AI Hints & Explanations** — Get step-by-step breakdowns and optimal time/space complexity analysis.

### 📊 Industry Dashboard
- **Live Market Insights** — AI-generated salary data, demand levels, top skills, and growth rates per industry.
- **Country-Specific Data** — Filter insights by region for localized salary benchmarks.
- **Weekly Auto-Refresh** — Data is automatically regenerated every 7 days to stay current.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **UI** | React 18, Tailwind CSS, shadcn/ui, Framer Motion |
| **Forms** | React Hook Form + Zod validation |
| **AI** | Google Gemini 1.5 Flash |
| **Auth** | Clerk (Google OAuth, Email/Password) |
| **Database** | PostgreSQL (via Prisma ORM) |
| **File Parsing** | pdf-parse, Mammoth.js (DOCX) |
| **Deployment** | Vercel + Vercel Postgres |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.17+
- **npm** or **yarn**
- A **PostgreSQL** database (local or cloud — [Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres) recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/Ritwik0218/SpyAi_Career_Coach.git
cd SpyAi_Career_Coach
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/onboarding"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Google Gemini AI
GEMINI_API_KEY="AIza..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you're live! 🎉

---

## 📁 Project Structure

```
SpyAi_Career_Coach/
├── app/
│   ├── (auth)/               # Sign-in / Sign-up pages
│   └── (main)/
│       ├── dashboard/         # Industry Insights Dashboard
│       ├── resume/            # Resume Builder & ATS Analyzer
│       ├── ai-cover-letter/   # Cover Letter Generator
│       ├── interview/         # Mock Interview + Negotiation Coach
│       ├── job-tracker/       # Kanban Job Application Tracker
│       ├── linkedin-optimizer/# LinkedIn PDF Analyzer
│       ├── coding-prep/       # Coding Interview Practice
│       ├── profile/           # User Profile & Career Settings
│       └── onboarding/        # First-time user setup
├── actions/                   # Next.js Server Actions
├── components/                # Shared UI components
├── data/                      # Static data (industries, FAQs, NeetCode problems)
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions (Prisma, Gemini, etc.)
├── prisma/                    # Database schema
└── public/                    # Static assets
```

---

## 🚀 Deploying to Vercel

1. **Push to GitHub** (already done!)
2. Go to [vercel.com](https://vercel.com) → **New Project** → import this repo.
3. Add all environment variables from your `.env` file in the Vercel dashboard.
4. Deploy. ✅

> ⚠️ Make sure to run `npx prisma db push` against your production database on first deploy.

### Required Environment Variables for Production

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_APP_URL` | Your production URL |

---

## 🧪 Development Scripts

```bash
npm run dev          # Start local dev server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npx prisma studio    # Open visual database browser
npx prisma db push   # Sync schema changes to database
```

---

## 🤝 Contributing

Contributions are welcome! Here's the workflow:

1. **Fork** the repository.
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: Add your feature'`
4. **Push**: `git push origin feature/your-feature-name`
5. **Open a Pull Request** and describe your changes.

Please follow the existing code style and keep commits focused.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Ritwik Mathur**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ritwik_Mathur-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ritwik-mathur-53ba20255/)
[![GitHub](https://img.shields.io/badge/GitHub-ritwik--mathur0218-181717?style=flat-square&logo=github)](https://github.com/Ritwik0218)

---

<div align="center">

**If SPY AI helped you, please ⭐ star the repo — it means a lot!**

Made with ❤️ by [Ritwik Mathur](https://www.linkedin.com/in/ritwik-mathur-53ba20255/)

</div>
