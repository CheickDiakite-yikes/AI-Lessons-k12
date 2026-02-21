import { ApiKeyGate } from '@/components/ApiKeyGate';
import { LessonPlanner } from '@/components/LessonPlanner';

export default function Home() {
  return (
    <ApiKeyGate>
      <LessonPlanner />
    </ApiKeyGate>
  );
}
