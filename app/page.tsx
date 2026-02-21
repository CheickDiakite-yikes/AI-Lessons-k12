'use client';

import { useState } from 'react';
import { ApiKeyGate } from '@/components/ApiKeyGate';
import { LessonPlanner } from '@/components/LessonPlanner';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return <LandingPage onLaunch={() => setShowApp(true)} />;
  }

  return (
    <ApiKeyGate>
      <LessonPlanner />
    </ApiKeyGate>
  );
}
