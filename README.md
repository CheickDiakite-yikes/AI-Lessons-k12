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

LessonCraft is a production-grade K-12 lesson planning web application for teachers, powered by Google Gemini AI. It enables teachers to create differentiated, standards-aligned lesson plans ranging from a single class period to a full semester.

The application features class roster management with individual student learning profiles, customizable worksheets (6 types), AI-generated presentation slide images, a visual lesson calendar, and PDF export. Built for Massachusetts DESE standards with K-6 elementary focus.

---

## Key Features

### 🤖 AI-Powered Lesson Generation
- **Dynamic Scaffolding:** Generates cohesive units from 1 day to a full semester using Bloom's Taxonomy progression.
- **Massachusetts DESE Alignment:** Specifically tuned for K-6 elementary standards in ELA, Math, Science, and Social Studies.
- **Personalized Differentiation:** Automatically modifies instruction based on student names, WIDA levels, and academic performance from your class rosters.

### 📝 Comprehensive Worksheet System
- **6 Specialized Types:** Matching, Fill in the Blank, Multiple Choice, Short Answer, True or False, and Sorting/Categorizing.
- **Smart Quality Assurance:** AI-driven post-processing ensures all worksheets are text-only and ready for immediate printing.
- **Student & Answer Keys:** Automatically generates both versions for every activity.

### 📅 Visual Lesson Calendar
- **Classroom-Ready View:** Drag-free, school-week focused (Mon-Fri) calendar with subject color-coding.
- **Multi-Day Continuity:** Units span across weekdays automatically, maintaining instructional flow.
- **Click-to-Edit:** Instantly load and modify any day of a generated unit directly from the grid.

### 🖼️ Presentation & Visuals
- **AI Slide Generation:** Automatically drafts lesson slides with structured content and child-friendly educational illustrations.
- **Secure Image Storage:** All generated assets are stored privately and securely using Replit Object Storage.

---

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Custom Sage Green Theme)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Neon-backed) via [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Google OAuth & Email/Password with bcrypt)
- **Storage:** [Replit Object Storage](https://docs.replit.com/storage/object-storage)
- **AI Integration:** Google Gemini 2.5 Flash & Imagen 3.0
- **Animations:** [Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Export:** [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A PostgreSQL database (DATABASE_URL)
- A Google Gemini API key (GEMINI_API_KEY)
- Google OAuth credentials (optional, for Google login)

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

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Used to encrypt NextAuth tokens |
| `NEXTAUTH_URL` | The base URL of your application |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GEMINI_API_KEY` | Your Google AI Studio API key |

---

## Technical Architecture

LessonCraft follows a modern serverless architecture optimized for AI performance. Detailed technical specifications, including API contracts, database schema diagrams, and pedagogical AI prompts, are available in the [replit.md](./replit.md) file.

---

## License

© 2026 LessonCraft. All rights reserved.
