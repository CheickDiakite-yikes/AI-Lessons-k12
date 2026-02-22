'use client';

import { ApiKeyGate } from '@/components/ApiKeyGate';
import { LessonPlanner } from '@/components/LessonPlanner';
import { LandingPage } from '@/components/LandingPage';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

function HomeContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLaunch = () => {
    if (!user) {
      router.push('/signup');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-crisp-page)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[var(--color-deep-ink)]"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  return (
    <ApiKeyGate>
      <LessonPlanner />
    </ApiKeyGate>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
