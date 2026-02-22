# AI Lesson Planner

## Overview
A K-12 lesson planner web application for teachers, powered by Google Gemini AI. Built with Next.js 15, Google OAuth (via NextAuth.js), PostgreSQL, Replit Object Storage, and the Google GenAI SDK.

## Project Architecture
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Google OAuth via NextAuth.js (Auth.js) with JWT sessions
- **Database**: PostgreSQL (Neon-backed via Replit) with Drizzle ORM
- **Object Storage**: Replit Object Storage (bucket: replit-objstore-042823b4-40f8-4c1f-859a-8e7689424cb3, "Teachers")
- **AI**: Google Gemini API via `@google/genai` SDK
- **Fonts**: Inter, Crimson Text, Fira Code (Google Fonts)

## Project Structure
```
app/                          - Next.js App Router pages
  page.tsx                    - Main page (landing or lesson planner based on auth)
  layout.tsx                  - Root layout
  login/                      - Login page (Google OAuth)
  signup/                     - Signup page (Google OAuth)
  about/                      - About page
  privacy/                    - Privacy policy
  terms/                      - Terms of service
  api/                        - API routes
    auth/[...nextauth]/route.ts - NextAuth.js handler
    users/sync/route.ts       - User profile GET
    class-rosters/route.ts    - Class rosters list/create (GET/POST)
    class-rosters/[id]/       - Class roster update/delete (PUT/DELETE)
      students/route.ts       - Students CRUD (POST/PUT/DELETE)
    lesson-plans/route.ts     - Lesson plans list/create (GET/POST)
    lesson-plans/[id]/route.ts - Lesson plan get/update/delete
    images/[key]/route.ts     - Image serving from object storage
components/                   - React components
  AuthProvider.tsx            - NextAuth SessionProvider wrapper + useAuth hook
  ApiKeyGate.tsx              - Gemini API key validation gate
  LessonPlanner.tsx           - Main lesson planning component
  LandingPage.tsx             - Public landing page
  PublicNav.tsx               - Navigation for public pages
  PublicFooter.tsx            - Footer for public pages
lib/                          - Utility libraries
  db/schema.ts                - Drizzle ORM schema (users, class_rosters, students, lesson_plans)
  db/index.ts                 - Database connection
  auth.ts                     - NextAuth.js configuration (Google provider, JWT callbacks)
  auth-server.ts              - Server-side auth helper (getAuthUser)
  storage.ts                  - Replit Object Storage utilities
  api-client.ts               - Client-side API helper (cookie-based auth)
  ai.ts                       - Gemini AI integration
  utils.ts                    - General utilities
types/next-auth.d.ts          - NextAuth session type extensions
hooks/                        - Custom React hooks
drizzle.config.ts             - Drizzle Kit configuration
```

## Database Schema
- **users**: id (UUID), google_id (unique), email, name, role, school, profile_image_key
- **class_rosters**: id (UUID), user_id (FK->users), name
- **students**: id (UUID), class_roster_id (FK->class_rosters), name, english_proficiency, reading_level, math_level, writing_level, academic_level, learning_preference
- **lesson_plans**: id (UUID), user_id (FK->users), class_roster_id (FK->class_rosters), title, content, image_prompt, image_key, parameters (JSONB)

## Object Storage
- Bucket: "Teachers" (replit-objstore-042823b4-40f8-4c1f-859a-8e7689424cb3)
- Image keys: `users/{userId}/profile/{timestamp}.png` for profile pics
- Image keys: `lesson-plans/{userId}/{timestamp}.png` for generated lesson images
- Images served via `/api/images/{encodedKey}` endpoint

## Authentication Flow
- Uses NextAuth.js with Google OAuth provider
- JWT session strategy (stateless)
- On sign-in, user is auto-created/updated in PostgreSQL users table
- Session includes DB user ID (`session.user.dbId`) for ownership checks
- API routes use `getAuthUser()` from `lib/auth-server.ts` to get authenticated user
- Client uses cookie-based auth (no manual token headers needed)

## Environment Variables / Secrets
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (secret)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (secret)
- `NEXTAUTH_SECRET` - NextAuth.js session encryption key
- `NEXTAUTH_URL` - App URL for NextAuth callbacks
- `GEMINI_API_KEY` - Required for Gemini AI API calls (server-side)
- `PORT` / `HOSTNAME` - Production server config

## Development
- Dev server: `npx next dev --hostname 0.0.0.0 --port 5000`
- Build: `npm run build`
- DB push: `npx drizzle-kit push`
- Production: Uses standalone output mode

## Authentication Flow
- **Email/Password**: Users sign up with name, email, password, role, school, how-found-us. Passwords hashed with bcryptjs (12 rounds). Login via NextAuth Credentials provider.
- **Google OAuth**: Users can also sign up/login via Google. If a Google user's email matches an existing email/password account, the accounts are linked.
- JWT session strategy (stateless), cookie-based auth
- API routes use `getAuthUser()` from `lib/auth-server.ts`
- Signup API: `POST /api/auth/signup` creates user with hashed password

## Recent Changes
- **Step-by-step progress tracker**: Generation UI shows animated progress steps (analyzing standards, designing structure, building differentiation, etc.) with checkmarks and spinners
- **Improved text formatting**: AI prompt enforces structured lists, bold labels, italics for teacher/student actions, sub-bullets, and timing markers. CSS updated for nested list support and sage-green markers
- **Presentation slides as images**: When "Include Slides" is enabled, AI generates structured slide data (title + bullets), then each slide is rendered as a beautiful image using Gemini 3 Pro Image Preview model. Slides display as a gallery with download buttons
- **Responsive layout**: Two-panel layout breakpoint moved from md to lg for better iPad/tablet support. Left panel is now an overlay on sub-1024px screens
- **Saved plans from database**: Real data fetched and displayed with click-to-load, delete, and metadata
- **Added email/password signup and login** alongside Google OAuth
- **Database schema updated**: Added `password_hash` column, made `google_id` nullable, made `email` unique index
- **Cookie-based API auth**: API routes use NextAuth session cookies instead of Bearer tokens
- All data persistence handled by PostgreSQL via Drizzle ORM
- Integrated Replit Object Storage for lesson images and profile pictures
