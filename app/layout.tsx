import type { Metadata } from 'next';
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
    icon: '/favicon.ico',
    apple: '/og-image.png',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteName,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable} ${fira.variable}`}>
      <body suppressHydrationWarning className="antialiased selection:bg-[var(--color-sage-green)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
