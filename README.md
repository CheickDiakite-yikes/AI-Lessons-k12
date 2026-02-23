# LessonCraft (AI Lesson Planner)

A beautifully designed K-12 lesson planner for teachers, powered by AI. LessonCraft empowers educators with AI-driven, highly differentiated lesson planning. Craft lessons, not stress.

## Features

- **AI-Powered Lesson Generation:** Quickly generate comprehensive lesson plans tailored to specific grade levels, subjects, and topics.
- **Differentiation:** Automatically create differentiated materials and strategies for various learning needs.
- **User Authentication:** Secure login and sign-up using Google Authentication or Email/Password, powered by Firebase.
- **Role-Based Access:** Support for different user roles (Teacher, Admin, Student).
- **Modern UI/UX:** A clean, responsive, and accessible user interface built with Tailwind CSS and Framer Motion.
- **Real-time Database:** Stores user profiles and lesson plans securely using Cloud Firestore.

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Authentication & Database:** [Firebase](https://firebase.google.com/) (Auth & Firestore)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integration:** Google Gemini API (via `@google/genai`)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase project
- A Google Gemini API key

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key
# Optional: comma-separated model priority for lesson generation
# Defaults to: gemini-3.0-flash,gemini-3-flash-preview,gemini-2.5-flash
GEMINI_LESSON_MODEL=gemini-3.0-flash
```

Make sure your `firebase-applet-config.json` is properly configured with your Firebase project details.

### Installation

1. Clone the repository or download the source code.
2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable React components (UI elements, layout components, etc.).
- `/lib`: Utility functions and Firebase configuration (`firebase.ts`).
- `/hooks`: Custom React hooks.
- `firebase-blueprint.json`: Defines the Firestore data schema (IR).
- `firestore.rules`: Firebase Security Rules for Firestore.

## Authentication Setup

This project uses Firebase Authentication. To enable it:

1. Go to your Firebase Console.
2. Navigate to **Authentication** > **Sign-in method**.
3. Enable **Email/Password** and **Google** providers.
4. Navigate to **Authentication** > **Settings** > **Authorized domains** and add every hostname you use for development and production.
5. If you are developing on Replit, add your current `*.replit.dev` host (exact hostname, no wildcard support).
6. Ensure your Firestore rules are deployed using the provided `firestore.rules` file.

## Security Rules

The application uses strict Firebase Security Rules to ensure data privacy and integrity. Only authenticated users can access their own data, and role-based access control is implemented to prevent unauthorized privilege escalation.

## License

© 2026 LessonCraft. All rights reserved.
