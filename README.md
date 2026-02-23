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

**Live at:** [https://Lessies.replit.app](https://Lessies.replit.app)

---

## Overview

LessonCraft is a production-grade K-12 lesson planning web application for teachers, powered by Google Gemini AI. It generates differentiated, standards-aligned lesson plans ranging from a single class period to a full semester — complete with worksheets, presentation slides, vocabulary lists, and assessment strategies. Built for Massachusetts DESE standards with a K-6 elementary focus.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router, standalone output) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) (strict mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + custom CSS design tokens |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Neon-backed) via [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [NextAuth.js v5](https://next-auth.js.org/) (Google OAuth + Email/Password) |
| **Image Storage** | [Replit Object Storage](https://docs.replit.com/storage/object-storage) |
| **AI (Text)** | Google Gemini 2.5 Flash via `@google/genai` |
| **AI (Images)** | Imagen 3.0 via `gemini-3-pro-image-preview` |
| **Animations** | [Motion](https://www.framer.com/motion/) (Framer Motion) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **PDF Export** | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) |
| **Markdown** | [react-markdown](https://github.com/remarkjs/react-markdown) |
| **Passwords** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (12-round hashing) |
| **Confetti** | [canvas-confetti](https://github.com/catdad/canvas-confetti) |
| **Typography** | Inter (body), Crimson Text (headings), Fira Code (monospace) |

---

## Features

### AI-Powered Lesson Generation
- **7 Plan Lengths:** Single Lesson, One Week, Two Weeks, Three Weeks, Four Weeks, One Quarter, One Semester.
- **4 Subjects:** ELA, Math, Science, Social Studies (1st through 6th Grade).
- **Configurable Duration:** Any lesson length in minutes.
- **Auto or Manual Objectives:** Let AI generate objectives from subject/grade, or provide your own learning objectives and topics.
- **Massachusetts DESE Standards:** Auto-aligned with official MA standard codes.
- **Bloom's Taxonomy Progression:** Multi-day plans follow a scaffolded arc from Remember/Understand through Evaluate/Create.
- **Tiered Pedagogical Framework:**
  - **Short plans (up to 5 days):** Simple daily Bloom's arc with spiral review.
  - **Medium plans (up to 20 days):** Weekly phases (Foundation, Skill Building, Application, Mastery).
  - **Long plans (45-90 days):** Thematic sub-units with cross-unit bridges, mid-point assessments, and culminating demonstrations.
- **Vocabulary Threading:** New terms introduced progressively, reviewed daily, cumulative word wall by end of unit.
- **Connection to Prior Learning:** Every day after Day 1 opens with an explicit link to what was learned the day before.
- **Spiral Review:** Every 5th day includes structured review of earlier concepts.

### Class Roster Management
- **Unlimited Rosters:** Create and manage multiple class groups.
- **Per-Student Learning Profiles:** Each student record includes:
  - English Proficiency Level (WIDA: Entering, Emerging, Developing, Expanding, Bridging)
  - Reading Level, Math Level, Writing Level (Significantly Below through Significantly Above Grade)
  - Academic Level (Below Grade, At Grade, Above Grade)
  - Learning Preference (Visual, Auditory, Kinesthetic, Reading/Writing, Needs 1v1, Direction-oriented)
- **Roster-Informed Differentiation:** When a roster is selected during generation, AI personalizes activities by student name and modifies instruction for each profile.

### Worksheet System
- **6 Specialized Types:**
  - **Matching:** Numbered terms + lettered definitions, draw-line format.
  - **Fill in the Blank:** Word bank + sentences with underscored blanks.
  - **Multiple Choice:** 8-10 questions with A/B/C/D options.
  - **Short Answer:** 5-6 questions with response lines, point values.
  - **True or False:** 8-10 statements with correction lines for false answers.
  - **Sorting / Categorizing:** 2-3 categories, 10-15 items to sort.
- **Multi-Select:** Choose up to 4 types per plan.
- **Dual Output:** Every worksheet includes both a Student Copy (with name/date header, directions, point totals) and a full Answer Key.
- **Differentiation Notes:** Each worksheet includes modifications for different student levels.
- **Quality Assurance:** Automated post-generation scan detects image placeholders and rewrites them into text-only equivalents at lower temperature (0.2) for precision.
- **Printable Design:** All worksheets are self-contained text documents ready for immediate classroom use.

### Presentation Slides
- **AI-Generated Content:** Structured slide outlines with titles and bullet points.
- **AI-Generated Images:** Each slide rendered as a child-friendly educational illustration using Imagen 3.0 (16:9 aspect ratio, 1K resolution).
- **Per-Slide Retry Logic:** If a slide image fails, it automatically retries once.
- **Persistent Storage:** All slide images uploaded to Object Storage with keys tracked in the lesson plan's parameters.
- **Gallery View:** Slides displayed in a scrollable carousel within the lesson viewer.

### Visual Lesson Calendar
- **School-Week Grid:** Monday through Friday only (no weekends).
- **Month & Week Views:** Toggle between full-month overview and detailed weekly strip.
- **Subject Color-Coding:**
  - ELA: Green (#6b9e7d)
  - Math: Tan (#c2956b)
  - Science: Blue (#5f8aad)
  - Social Studies: Purple (#a87dba)
  - Art: Coral (#d4887a)
  - Music: Teal (#8ab5a8)
  - PE: Gold (#c9a84c)
- **Multi-Day Spanning:** Units automatically fill consecutive weekdays (skipping Saturday/Sunday).
- **Click-to-Load:** Click any day cell to load that specific day of a saved plan.
- **Today Highlighting:** Current date (Eastern Time) highlighted in blue.
- **Start Date Picker:** Set the starting date for any generated plan to position it on the calendar.

### PDF Export
- **Full Lesson Export:** Export the entire lesson plan (or all days of a unit) as a formatted PDF.
- **Worksheet Export:** Export individual worksheets as Student Copy or Answer Key PDFs.
- **Print-Ready:** Letter-format, portrait orientation, JPEG rendering at 2x scale.
- **Custom Filenames:** Auto-generated names including subject, grade level, and day count.
- **Confetti Celebration:** Success animation on export completion.

### Authentication & Security
- **Dual Login Methods:**
  - Google OAuth (one-click sign-in)
  - Email/Password (registration with 8-character minimum, bcrypt 12-round hashing)
- **Automatic Account Linking:** If a user signs up with email then later logs in with Google (same email), accounts are linked automatically.
- **JWT Session Management:** Stateless cookie-based sessions with custom claims (dbId, role, school).
- **User Registration Fields:** Name, email, password, role (teacher default), school (optional), how-did-you-hear (optional).
- **Per-User Data Isolation:** All database queries filter by authenticated user ID.
- **Image Access Control:** Object Storage images require auth and enforce ownership (keys must contain the user's ID).
- **Rate Limiting:** 20 AI requests per minute per user (in-memory sliding window).
- **HTTP Security Headers:**
  - Strict-Transport-Security (HSTS with preload, 2-year max-age)
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: SAMEORIGIN
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  - X-Powered-By header removed
- **Input Validation:** Email regex, password length, required field checks, identifier sanitization (alphanumeric + hyphens, max 48 chars).

### User Interface & Design
- **Two-Panel Layout:** Collapsible input sidebar (left) + main output viewer (right).
- **Responsive Design:** Sidebar becomes overlay on screens < 1024px. Calendar, inputs, and toggles optimized for mobile.
- **Custom Design System:**
  - Sage Green theme (#6B9E81) with warm neutrals (Whisper White #FBF9F6, Soft Clay #EAE3DB, Crisp Page #FAF7F3)
  - Neo-brutalist aesthetic: thick borders, offset drop shadows (8px/8px/0px/0px), bold typography
  - Color-cycling procedure step circles (gold, green, pink, sky blue) with dashed connector lines
  - Differentiation callout boxes with dashed borders
  - Custom scrollbar styling matching the clay/charcoal palette
- **Step-by-Step Progress Tracker:** Animated generation UI showing each stage with checkmarks and progress icons.
- **Confetti Animation:** Canvas-confetti fires on successful lesson generation and PDF export.
- **Saved Plans Management:** Load, delete, rename, and re-date previously generated plans. Plans stored newest-first.
- **Profile Page:** User info display with profile picture upload to Object Storage.
- **Landing Page:** Hero section with animated decorative elements, "How It Works" 3-step guide, feature highlights with mock-up preview, testimonial carousel (auto-scrolling marquee with pause-on-hover), FAQ accordion, and footer with legal links.
- **SEO Optimization:** Full metadata (title, description, 13 keywords), OpenGraph tags (1200x675 image), Twitter card, robots config, dynamic sitemap, PWA manifest with app icons.

### AI Pipeline Details
- **Primary Model:** Gemini 2.5 Flash (fast, cost-effective).
- **Model Fallback Chain:** Configurable via `GEMINI_LESSON_MODELS` env var. Default chain: gemini-3.0-flash, gemini-3-flash-preview, gemini-2.5-flash. Automatically retries with next model on 429/503/RESOURCE_EXHAUSTED errors.
- **Generation Temperature:** 0.45 for lesson content (creative but structured), 0.2 for worksheet QA rewrites (precise corrections).
- **Server Timeout:** 120 seconds max duration per request.
- **Client Timeout:** 115 seconds with AbortController, 3 retry attempts with exponential backoff (1s, 3s, 6s delays).
- **Client Retry Logic:** Retries on 5xx errors, timeout (AbortError), and network failures (TypeError). Immediately throws on 4xx errors.
- **Markdown Normalization:** Post-processing converts any pipe tables to structured bullet lists, removes horizontal rules, collapses excessive blank lines. Vocabulary tables auto-detected and reformatted with Term/Definition/Illustration sub-bullets.
- **Tag Extraction:** AI output includes `<IMAGE_PROMPT>`, `<LESSON_OVERVIEW>`, and `<SLIDE>` tags which are parsed and stripped from the final markdown.

---

## Project Structure

```
workspace/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Root: LandingPage or LessonPlanner based on auth
│   ├── layout.tsx                    # Root layout: fonts, metadata, SEO, PWA
│   ├── globals.css                   # Global styles (536 LOC): design tokens, prose,
│   │                                 #   procedure circles, worksheet styling, animations
│   ├── sitemap.ts                    # Dynamic sitemap.xml generation
│   ├── login/page.tsx                # Login form (Google OAuth + email/password)
│   ├── signup/page.tsx               # Registration form (name, email, pass, role, school)
│   ├── about/page.tsx                # About page
│   ├── privacy/page.tsx              # Privacy policy
│   ├── terms/page.tsx                # Terms of service
│   └── api/                          # 12 API route files
│       ├── auth/[...nextauth]/       # NextAuth handler (GET, POST)
│       ├── auth/signup/              # User registration (POST)
│       ├── ai/lesson-plan/           # AI lesson generation (POST, rate-limited)
│       ├── ai/image/                 # AI image generation (POST, rate-limited)
│       ├── lesson-plans/             # Plan CRUD (GET, POST)
│       ├── lesson-plans/[id]/        # Single plan (GET, PUT, DELETE + image cleanup)
│       ├── class-rosters/            # Roster CRUD (GET, POST)
│       ├── class-rosters/[id]/       # Single roster (PUT, DELETE)
│       ├── class-rosters/[id]/students/ # Student CRUD (POST, PUT, DELETE)
│       ├── images/[key]/             # Serve images from Object Storage (GET, auth+ownership)
│       ├── images/upload/            # Upload images (POST, sanitized identifier)
│       └── users/sync/              # User profile (GET)
│
├── components/                       # React components
│   ├── LessonPlanner.tsx             # Main planning interface (2115 LOC)
│   ├── LessonCalendar.tsx            # Visual calendar (326 LOC)
│   ├── LandingPage.tsx               # Public marketing page (302 LOC)
│   ├── AuthProvider.tsx              # NextAuth session wrapper + useAuth() hook
│   ├── ApiKeyGate.tsx                # Gemini API key check gate
│   ├── CustomLogo.tsx                # SVG logo component
│   ├── PublicNav.tsx                 # Animated scroll-aware navbar
│   ├── PublicNavStatic.tsx           # Static navbar for legal pages
│   └── PublicFooter.tsx              # Site footer with legal links
│
├── lib/                              # Shared utilities
│   ├── ai-server.ts                  # Server-side AI logic (761 LOC): prompt construction,
│   │                                 #   Gemini generation, model fallback, worksheet QA,
│   │                                 #   pedagogical framework, scope & sequence
│   ├── ai.ts                         # Client-side AI wrapper: retry logic, timeout, fetch
│   ├── auth.ts                       # NextAuth config: providers, callbacks, JWT strategy
│   ├── auth-server.ts                # Server auth helper: getAuthUser(), unauthorizedResponse()
│   ├── api-client.ts                 # Client HTTP wrapper: all api.* methods
│   ├── lesson-markdown.ts            # Markdown normalizer: pipe table → bullet list conversion
│   ├── rate-limit.ts                 # In-memory rate limiter (sliding window, auto-cleanup)
│   ├── storage.ts                    # Object Storage wrapper: upload, download, delete, keygen
│   ├── utils.ts                      # cn() classname merge helper (clsx + tailwind-merge)
│   └── db/
│       ├── schema.ts                 # Drizzle ORM schema: 4 tables with relations
│       └── index.ts                  # DB connection (Neon Pool + Drizzle instance)
│
├── hooks/
│   └── use-mobile.ts                 # Mobile viewport detection hook
│
├── types/
│   └── next-auth.d.ts                # Session type extensions (dbId, role, school)
│
├── public/                           # Static assets
│   ├── manifest.json                 # PWA manifest
│   ├── favicon.ico                   # Favicon (32x32)
│   ├── icon-192.png / icon-512.png   # PWA icons
│   ├── apple-touch-icon.png          # iOS icon
│   └── og-image.png                  # OpenGraph image (1200x675)
│
├── drizzle.config.ts                 # Drizzle Kit: schema path, pg dialect, DATABASE_URL
├── next.config.ts                    # Next.js: standalone output, security headers, webpack
├── tsconfig.json                     # TypeScript: ESNext target, @/* path alias
├── tailwind.config.ts                # Tailwind config
├── package.json                      # Dependencies and scripts
└── replit.md                         # Detailed technical architecture documentation
```

---

## Database Schema

Four PostgreSQL tables managed via Drizzle ORM:

| Table | Key Columns | Relationships |
| :--- | :--- | :--- |
| **users** | id (UUID PK), google_id (unique), email (unique), name, password_hash, role, school, how_did_you_hear, profile_image_key | Has many class_rosters, lesson_plans |
| **class_rosters** | id (UUID PK), user_id (FK), name | Belongs to user, has many students, has many lesson_plans |
| **students** | id (UUID PK), class_roster_id (FK), name, english_proficiency, reading_level, math_level, writing_level, academic_level, learning_preference | Belongs to class_roster |
| **lesson_plans** | id (UUID PK), user_id (FK), class_roster_id (FK nullable), title, plan_length, grade_level, subject, duration, content (TEXT), image_prompt, lesson_overview, image_key, start_date, parameters (JSONB) | Belongs to user and optionally class_roster |

The `parameters` JSONB column stores generation settings, worksheet types, slide image keys, and other flexible metadata without requiring schema migrations.

---

## API Endpoints

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | No | Register new user (bcrypt hash, email validation, duplicate check) |
| GET/POST | `/api/auth/[...nextauth]` | No | NextAuth handler (OAuth callback, credentials login, session) |
| POST | `/api/ai/lesson-plan` | Yes | Generate lesson plan (rate limited: 20/min, 120s timeout) |
| POST | `/api/ai/image` | Yes | Generate image (rate limited: 20/min, Imagen 3.0) |
| GET | `/api/lesson-plans` | Yes | List user's saved plans (newest first) |
| POST | `/api/lesson-plans` | Yes | Save new plan (with optional image upload) |
| GET | `/api/lesson-plans/[id]` | Yes | Get single plan (ownership verified) |
| PUT | `/api/lesson-plans/[id]` | Yes | Update plan fields (allowlisted) |
| DELETE | `/api/lesson-plans/[id]` | Yes | Delete plan + cascade delete all stored images |
| GET | `/api/class-rosters` | Yes | List rosters with nested students |
| POST | `/api/class-rosters` | Yes | Create new roster |
| PUT | `/api/class-rosters/[id]` | Yes | Rename roster |
| DELETE | `/api/class-rosters/[id]` | Yes | Delete roster (cascades to students) |
| POST | `/api/class-rosters/[id]/students` | Yes | Add student to roster |
| PUT | `/api/class-rosters/[id]/students` | Yes | Update student (roster ownership verified) |
| DELETE | `/api/class-rosters/[id]/students?studentId=` | Yes | Remove student |
| GET | `/api/images/[key]` | Yes | Serve image from Object Storage (ownership check, 1hr cache) |
| POST | `/api/images/upload` | Yes | Upload base64 image (sanitized identifier, generates storage key) |
| GET | `/api/users/sync` | Yes | Get authenticated user's full profile |

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (auto-set on Replit) |
| `NEXTAUTH_SECRET` | Yes | JWT encryption key for NextAuth sessions |
| `NEXTAUTH_URL` | Yes | Canonical application URL (used for OAuth callbacks) |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key for Gemini models |
| `GOOGLE_CLIENT_ID` | For Google login | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | For Google login | Google OAuth 2.0 Client Secret |
| `GEMINI_LESSON_MODELS` | No | Comma-separated model override list (default: gemini-3.0-flash, gemini-3-flash-preview, gemini-2.5-flash) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Google Gemini API key ([Get one at Google AI Studio](https://aistudio.google.com/))
- Google OAuth credentials (optional, for Google sign-in)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see table above)

# 3. Push database schema
npx drizzle-kit push

# 4. Start development server
npm run dev
```

### Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Build for production (standalone output) |
| `start` | `next start` | Start production server |
| `lint` | `next lint` | Run ESLint |
| `clean` | `rm -rf .next` | Clear build cache |

---

## Object Storage

All generated images are stored in Replit Object Storage with structured key patterns:

| Pattern | Usage |
| :--- | :--- |
| `users/{userId}/profile/{timestamp}.png` | User profile pictures |
| `lesson-plans/{userId}/{timestamp}.png` | Lesson hero illustrations |
| `lesson-plans/{userId}/{timestamp}-slide-{N}.png` | Presentation slide images |

Images are served through `/api/images/[key]` with authentication and ownership verification. Deleting a lesson plan cascades to delete its hero image and all associated slide images from storage.

---

## Architecture Notes

- **Standalone Build:** Next.js `output: 'standalone'` for minimal production deployment footprint.
- **Serverless-Compatible:** All API routes are stateless (except in-memory rate limiter which resets on restart).
- **Model Resilience:** The Gemini model fallback chain ensures generation continues even if the primary model is rate-limited or unavailable.
- **Worksheet QA Pipeline:** A dedicated second AI call (at lower temperature) automatically detects and rewrites any worksheet content containing image placeholders, ensuring all worksheets are text-only and print-ready.
- **Markdown Normalization:** Post-processing ensures clean rendering regardless of how the AI formats its output (pipe tables converted to lists, horizontal rules stripped, excessive whitespace collapsed).
- **Image Ownership Security:** Every image request validates that the storage key contains the authenticated user's ID, preventing cross-user access.

For exhaustive technical documentation including full API contracts, database schema diagrams, authentication flow step-by-step, AI prompt templates, and component architecture, see [replit.md](./replit.md).

---

## License

&copy; 2026 LessonCraft. All rights reserved.
