# LessonCraft - AI Lesson Planner

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║      ██╗     ███████╗███████╗███████╗ ██████╗ ███╗   ██╗     ║
  ║      ██║     ██╔════╝██╔════╝██╔════╝██╔═══██╗████╗  ██║     ║
  ║      ██║     █████╗  ███████╗███████╗██║   ██║██╔██╗ ██║     ║
  ║      ██║     ██╔══╝  ╚════██║╚════██║██║   ██║██║╚██╗██║     ║
  ║      ███████╗███████╗███████║███████║╚██████╔╝██║ ╚████║     ║
  ║      ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝     ║
  ║                                                              ║
  ║        ██████╗██████╗  █████╗ ███████╗████████╗              ║
  ║       ██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝              ║
  ║       ██║     ██████╔╝███████║█████╗     ██║                 ║
  ║       ██║     ██╔══██╗██╔══██║██╔══╝     ██║                 ║
  ║       ╚██████╗██║  ██║██║  ██║██║        ██║                 ║
  ║        ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝                 ║
  ║                                                              ║
  ║          Craft Lessons. Not Stress.                           ║
  ║          AI-Powered K-12 Lesson Planning                     ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
```

## Overview

LessonCraft is a production-grade K-12 lesson planning web application for teachers, powered by Google Gemini AI. It enables teachers to create differentiated, standards-aligned lesson plans ranging from a single class period to a full semester. The application features class roster management with individual student learning profiles, customizable worksheets (6 types), AI-generated presentation slide images, a visual lesson calendar, and PDF export. Built for Massachusetts DESE standards with K-6 elementary focus.

---

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Neon-backed) via [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Google OAuth & Email/Password)
- **Storage:** [Replit Object Storage](https://docs.replit.com/storage/object-storage)
- **AI Integration:** Google Gemini API (via `@google/genai`)
- **Animations:** [Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database (DATABASE_URL)
- A Google Gemini API key (GEMINI_API_KEY)
- Google OAuth credentials (for Google login)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sync the database schema:
   ```bash
   npx drizzle-kit push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Environment Variables

Create a `.env` or use Replit Secrets for the following:

```env
DATABASE_URL=postgres://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=your_app_url
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GEMINI_API_KEY=your_key
```

---

## Technical Architecture

Detailed technical documentation, including API contracts, database schema, and AI pipeline details, can be found in [replit.md](./replit.md).

---

## License

© 2026 LessonCraft. All rights reserved.
