import type { Metadata, Viewport } from 'next';
import { Inter, Crimson_Text, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const crimson = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
});

const fira = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
  display: 'swap',
});

const siteUrl = process.env.NEXTAUTH_URL || 'https://Lessies.replit.app';
const siteName = 'LessonCraft';
const siteDescription = 'The AI-powered lesson planner that actually understands your classroom. Build highly differentiated, engaging K-12 lesson plans in seconds.';
const siteTitle = 'LessonCraft – AI Lesson Planner for K-12 Teachers';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'lesson planner',
    'AI lesson planner',
    'K-12 lesson plans',
    'teacher tools',
    'differentiated instruction',
    'lesson planning app',
    'education technology',
    'EdTech',
    'classroom planning',
    'curriculum planning',
    'teaching assistant AI',
    'elementary lesson plans',
    'middle school lesson plans',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  applicationName: siteName,
  category: 'Education',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 675,
        alt: 'LessonCraft – Craft Lessons, Not Stress',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/og-image.png'],
    creator: '@lessoncraft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteName,
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable} ${fira.variable}`}>
      <head>
        <meta name="theme-color" content="#4a6741" />
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-[var(--color-sage-green)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
