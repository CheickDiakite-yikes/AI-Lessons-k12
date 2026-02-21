'use client';

import { useState, useEffect } from 'react';
import { ApiKeyGate } from '@/components/ApiKeyGate';
import { LessonPlanner } from '@/components/LessonPlanner';
import { LandingPage } from '@/components/LandingPage';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (user) {
      setShowApp(true);
    } else {
      setShowApp(false);
    }
  }, [user]);

  const handleLaunch = () => {
    if (user) {
      setShowApp(true);
    } else {
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

  if (!showApp) {
    return <LandingPage onLaunch={handleLaunch} />;
  }

  return (
    <ApiKeyGate>
      <LessonPlanner />
    </ApiKeyGate>
  );
}
