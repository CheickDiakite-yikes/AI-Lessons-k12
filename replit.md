# LessonCraft - AI Lesson Planner

## Overview

LessonCraft is a production-grade K-12 lesson planning web application for teachers, powered by Google Gemini AI. It enables teachers to create differentiated, standards-aligned lesson plans ranging from a single class period to a full semester. Key capabilities include class roster management, student learning profiles, customizable worksheets, presentation slides, and a visual lesson calendar. The project aims to streamline lesson preparation, allowing teachers to focus more on teaching and less on administrative tasks.

## User Preferences

- Framework: Next.js with App Router
- Styling: Tailwind CSS with custom design tokens (sage green theme)
- AI Model: Gemini 2.5 Flash for speed
- State: Massachusetts DESE standards alignment
- Grade focus: K-6 elementary

## System Architecture

LessonCraft is built on Next.js 15.3 (App Router) using TypeScript 5.9 and Tailwind CSS 4 for styling, complemented by custom CSS variables for theming (sage green, deep ink, crisp page). Authentication is handled via NextAuth.js v5, supporting Google OAuth and email/password credentials with automatic account linking and JWT sessions for stateless authorization.

The application features a clear client-server architecture. The client-side provides a responsive UI for lesson planning, class roster management, and a visual calendar. The Next.js API layer exposes endpoints for authentication, lesson plan CRUD operations, class roster and student management, AI generation, and image storage/retrieval.

Core architectural decisions include:
- **Gemini 2.5 Flash** for AI generation, prioritized for speed and sufficient quality, with a model fallback mechanism.
- **Drizzle ORM** over Prisma for its lightweight nature, superior TypeScript inference, and faster cold starts.
- **Cookie-based JWT sessions** for automatic browser handling and statelessness, enhancing scalability.
- **JSONB parameters column** in the database for flexible storage of evolving lesson plan settings without requiring schema migrations.
- **Replit Object Storage** for binary data (images), optimizing for CDN delivery and reducing database load.
- **Pedagogical Framework**: AI prompt system uses tiered scaffolding based on plan length, incorporating Bloom's Taxonomy progression for multi-day plans. Each daily section includes elements like "Connection to Prior Learning," "Vocabulary Focus," and "Exit Ticket."
- **Worksheet System**: Teachers can select up to four of six worksheet types (Matching, Fill in the Blank, Multiple Choice, Short Answer, True or False, Sorting/Categorizing), with AI enforcing strict formatting and generating a student copy, answer key, and differentiation note.
- **Lesson Calendar**: A Mon-Fri school-day grid with month/week toggle views, color-coded subjects, and functionality to span multi-day plans and load plans by day.
- **AI Lesson Generation Pipeline**: Involves dynamic prompt building based on teacher input, Gemini AI generation, post-processing (worksheet QA, slide extraction and image generation via Imagen-3.0, markdown normalization), and persistent storage.

## External Dependencies

- **Google Gemini AI API (@google/genai)**: Primary AI engine for lesson plan generation (Gemini 2.5 Flash) and image generation (Imagen-3.0 for presentation slides).
- **PostgreSQL (Neon)**: Relational database for storing user data, class rosters, student profiles, and lesson plans. Managed with Drizzle ORM.
- **Replit Object Storage**: Cloud storage solution for user profile images, AI-generated lesson illustrations, and presentation slide images.
- **NextAuth.js v5**: Authentication library supporting Google OAuth and credential-based login.
- **Framer Motion**: JavaScript library for animations.
- **Lucide React**: Icon library.
- **react-markdown**: React component for rendering Markdown.
- **html2pdf.js**: JavaScript library for exporting lesson plans as PDF documents.