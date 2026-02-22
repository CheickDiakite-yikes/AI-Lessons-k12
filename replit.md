# AI Lesson Planner

## Overview
A K-12 lesson planner web application for teachers, powered by Google Gemini AI. Built with Next.js 15, Firebase Authentication, Firestore, and the Google GenAI SDK.

## Project Architecture
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Firestore
- **AI**: Google Gemini API via `@google/genai` SDK
- **Fonts**: Inter, Crimson Text, Fira Code (Google Fonts)

## Project Structure
```
app/              - Next.js App Router pages
  page.tsx        - Main page (landing or lesson planner based on auth)
  layout.tsx      - Root layout with AuthProvider
  login/          - Login page
  signup/         - Signup page
  about/          - About page
  privacy/        - Privacy policy
  terms/          - Terms of service
components/       - React components
  AuthProvider.tsx - Firebase auth context provider
  ApiKeyGate.tsx  - Gemini API key validation gate
  LessonPlanner.tsx - Main lesson planning component
  LandingPage.tsx - Public landing page
  PublicNav.tsx   - Navigation for public pages
  PublicFooter.tsx - Footer for public pages
lib/              - Utility libraries
  firebase.ts     - Firebase initialization
  ai.ts           - Gemini AI integration
  utils.ts        - General utilities
hooks/            - Custom React hooks
```

## Environment Variables
- `NEXT_PUBLIC_GEMINI_API_KEY` - Required for Gemini AI API calls
- `APP_URL` - The URL where the app is hosted

## Firebase Configuration
Firebase config is stored in `firebase-applet-config.json` with project ID `didi-421517`.

## Development
- Dev server: `npx next dev --hostname 0.0.0.0 --port 5000`
- Build: `npm run build`
- Production: Uses standalone output mode

## Recent Changes
- Downgraded Next.js from 15.5 to 15.3.3 (SWC compatibility with Replit)
- Added `allowedDevOrigins` for Replit proxy compatibility
- Configured deployment for autoscale mode with standalone output
- Fixed webpack watch options to use polling (2s interval) to prevent HMR infinite recompilation loop on Replit's virtual filesystem
- Production deployment: `npm run build` then `npm run start` (PORT and HOSTNAME set in production env vars)
