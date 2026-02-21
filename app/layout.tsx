import type { Metadata } from 'next';
import { Inter, Crimson_Text, Fira_Code } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

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

export const metadata: Metadata = {
  title: 'AI Lesson Planner',
  description: 'A beautifully designed K-12 lesson planner for teachers, powered by AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable} ${fira.variable}`}>
      <body suppressHydrationWarning className="antialiased selection:bg-[var(--color-sage-green)] selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
