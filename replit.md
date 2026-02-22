# AI Lesson Planner

## Overview
A K-12 lesson planner web application for teachers, powered by Google Gemini AI. Built with Next.js 15, Firebase Authentication, PostgreSQL, Replit Object Storage, and the Google GenAI SDK.

## Project Architecture
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth (Google Sign-In + Email/Password)
- **Database**: PostgreSQL (Neon-backed via Replit) with Drizzle ORM
- **Object Storage**: Replit Object Storage (bucket: replit-objstore-042823b4-40f8-4c1f-859a-8e7689424cb3, "Teachers")
- **AI**: Google Gemini API via `@google/genai` SDK
- **Fonts**: Inter, Crimson Text, Fira Code (Google Fonts)

## Project Structure
```
app/                          - Next.js App Router pages
  page.tsx                    - Main page (landing or lesson planner based on auth)
  layout.tsx                  - Root layout with AuthProvider
  login/                      - Login page
  signup/                     - Signup page
  about/                      - About page
  privacy/                    - Privacy policy
  terms/                      - Terms of service
  api/                        - API routes
    users/sync/route.ts       - User profile sync (POST/GET)
    class-rosters/route.ts    - Class rosters list/create (GET/POST)
    class-rosters/[id]/       - Class roster update/delete (PUT/DELETE)
      students/route.ts       - Students CRUD (POST/PUT/DELETE)
    lesson-plans/route.ts     - Lesson plans list/create (GET/POST)
    lesson-plans/[id]/route.ts - Lesson plan get/update/delete
    images/[key]/route.ts     - Image serving from object storage
components/                   - React components
  AuthProvider.tsx            - Firebase auth context + PostgreSQL sync
  ApiKeyGate.tsx              - Gemini API key validation gate
  LessonPlanner.tsx           - Main lesson planning component
  LandingPage.tsx             - Public landing page
  PublicNav.tsx               - Navigation for public pages
  PublicFooter.tsx            - Footer for public pages
lib/                          - Utility libraries
  db/schema.ts                - Drizzle ORM schema (users, class_rosters, students, lesson_plans)
  db/index.ts                 - Database connection
  firebase.ts                 - Firebase client initialization
  auth-server.ts              - Firebase Admin SDK for server-side token verification
  storage.ts                  - Replit Object Storage utilities
  api-client.ts               - Client-side API helper
  ai.ts                       - Gemini AI integration
  utils.ts                    - General utilities
hooks/                        - Custom React hooks
drizzle.config.ts             - Drizzle Kit configuration
```

## Database Schema
- **users**: id (UUID), firebase_uid (unique), email, name, role, school, profile_image_key
- **class_rosters**: id (UUID), user_id (FK->users), name
- **students**: id (UUID), class_roster_id (FK->class_rosters), name, english_proficiency, reading_level, math_level, writing_level, academic_level, learning_preference
- **lesson_plans**: id (UUID), user_id (FK->users), class_roster_id (FK->class_rosters), title, content, image_prompt, image_key, parameters (JSONB)

## Object Storage
- Bucket: "Teachers" (replit-objstore-042823b4-40f8-4c1f-859a-8e7689424cb3)
- Image keys: `users/{userId}/profile/{timestamp}.png` for profile pics
- Image keys: `lesson-plans/{userId}/{timestamp}.png` for generated lesson images
- Images served via `/api/images/{encodedKey}` endpoint

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)
- `NEXT_PUBLIC_GEMINI_API_KEY` - Required for Gemini AI API calls
- `APP_URL` - The URL where the app is hosted
- `PORT` / `HOSTNAME` - Production server config

## Firebase Configuration
Firebase config is stored in `firebase-applet-config.json` with project ID `didi-421517`.
Firebase Auth handles authentication; user profiles are synced to PostgreSQL on login/signup.

## Development
- Dev server: `npx next dev --hostname 0.0.0.0 --port 5000`
- Build: `npm run build`
- DB push: `npx drizzle-kit push`
- Production: Uses standalone output mode

## Recent Changes
- Removed Firestore dependency from firebase.ts - no more old Firebase database connection
- Firebase is now used ONLY for authentication (Google Sign-In + Email/Password)
- All data persistence handled by PostgreSQL via Drizzle ORM
- Integrated Replit Object Storage for lesson images and profile pictures
- Added API routes for all CRUD operations with Firebase token authentication
- Class rosters and students now persist across sessions
- Generated lesson plans auto-save to database with images stored in object storage
- Login/signup pages simplified to use Firebase Auth + PostgreSQL sync
- Fixed webpack watch options to use polling (2s interval) for Replit compatibility
