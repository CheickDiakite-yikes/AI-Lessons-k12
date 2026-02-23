# LessonCraft - AI Lesson Planner

## Overview

LessonCraft is a production-grade K-12 lesson planning web application designed for teachers, powered by Google Gemini AI. It enables the creation of differentiated, standards-aligned lesson plans ranging from a single class period to a full semester. Key features include class roster management with individual student learning profiles, customizable worksheets (6 types), AI-generated presentation slide images, a visual lesson calendar, and PDF export. The project focuses on Massachusetts DESE standards for K-6 elementary education.

## User Preferences

- Framework: Next.js with App Router
- Styling: Tailwind CSS with custom design tokens (sage green theme)
- AI Model: Gemini 2.5 Flash for speed, imagen-3.0 for slide images
- State Standards: Massachusetts DESE alignment
- Grade focus: K-6 elementary
- Preferred tooling: Drizzle ORM (over Prisma), cookie-based JWT, JSONB for flexible params

## System Architecture

The application is built with Next.js using the App Router, providing both client-side and server-side functionalities. Authentication is handled via NextAuth.js, supporting Google OAuth and email/password credentials, with session management using JWTs.

**UI/UX Design:**
The user interface features a two-panel layout (input sidebar and main output area), which adapts responsively to smaller screens. The design utilizes a custom sage green theme with Inter for body text, Crimson Text for headings, and Fira Code for monospace elements. Buttons, cards, and inputs are styled with distinct borders and shadows. Procedure steps in lesson plans are visually enhanced with numbered, color-cycling circles and dashed connector lines.

**Technical Implementations:**
- **Lesson Planning:** Teachers configure plan length, grade level, subject, duration, student profiles, worksheet types, and slide inclusion.
- **AI Generation:** The core AI logic resides server-side, building dynamic prompts for Google Gemini 2.5 Flash. It constructs pedagogical frameworks (Bloom's Taxonomy progression, scope and sequence) tailored to plan length. A dedicated "worksheet QA" pass ensures text-only worksheets by rewriting any AI-generated image placeholders.
- **Data Management:** Lesson plans, class rosters, and student profiles are stored in a PostgreSQL database managed by Drizzle ORM. Flexible parameters for lesson plans are stored in a JSONB column.
- **Image Handling:** Presentation slide images and lesson illustrations are generated using the `gemini-3-pro-image-preview` model and stored in Replit Object Storage.
- **Worksheet System:** Supports 6 types of worksheets (Matching, Fill in the Blank, Multiple Choice, Short Answer, True or False, Sorting/Categorizing), with strict formatting templates and a post-generation rewrite process to ensure printability.
- **Calendar:** A visual lesson calendar allows teachers to view and navigate their saved plans, with color-coded subjects and multi-day plans spanning weekdays.
- **PDF Export:** Lesson plans and worksheets can be exported as PDF documents using `html2pdf.js`.
- **Security:** HTTP security headers are configured in `next.config.ts`, including HSTS, X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection. API routes implement robust authentication, authorization (user-specific data access), input validation, and rate limiting (20 requests/min per user for AI calls). Passwords are hashed with bcrypt.

## External Dependencies

- **Google Gemini API:** `gemini-2.5-flash` for text-based lesson generation and `gemini-3-pro-image-preview` (Imagen 3.0) for image generation. Accessed via `@google/generative-ai`.
- **Next.js:** Web framework.
- **Tailwind CSS:** For styling.
- **NextAuth.js:** For authentication, supporting Google OAuth and credentials provider.
- **PostgreSQL (Neon-backed):** Database for persistent storage.
- **Drizzle ORM:** Object-Relational Mapper for database interactions.
- **@neondatabase/serverless:** PostgreSQL driver.
- **Replit Object Storage:** For storing generated images (profile pictures, lesson illustrations, presentation slides).
- **Framer Motion:** For animations.
- **Lucide React:** For icons.
- **react-markdown:** For rendering Markdown content.
- **html2pdf.js:** For PDF export functionality.
- **bcryptjs:** For password hashing.
- **canvas-confetti:** For celebratory animations on successful lesson generation.