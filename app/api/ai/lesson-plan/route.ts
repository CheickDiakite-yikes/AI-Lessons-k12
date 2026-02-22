import { NextRequest } from 'next/server';
import { generateLessonPlanServer } from '@/lib/ai-server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorizedResponse();

    const rl = rateLimit(`ai:${authUser.id}`, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.success) {
      return Response.json({ error: 'Too many requests. Please wait a moment before generating another plan.' }, { status: 429 });
    }

    const body = await request.json();
    const {
      planLength,
      gradeLevel,
      subject,
      duration,
      englishProficiency,
      academicLevels,
      autoGenerate,
      manualObjectives,
      includeWorksheets,
      includeSlides,
      studentsContext,
    } = body;

    if (!planLength || !gradeLevel || !subject || !duration) {
      return Response.json({ error: 'Missing required lesson generation parameters.' }, { status: 400 });
    }

    const plan = await generateLessonPlanServer({
      planLength,
      gradeLevel,
      subject,
      duration,
      englishProficiency: Array.isArray(englishProficiency) ? englishProficiency : [],
      academicLevels: Array.isArray(academicLevels) ? academicLevels : [],
      autoGenerate: Boolean(autoGenerate),
      manualObjectives: typeof manualObjectives === 'string' ? manualObjectives : '',
      includeWorksheets: Boolean(includeWorksheets),
      includeSlides: Boolean(includeSlides),
      studentsContext: typeof studentsContext === 'string' ? studentsContext : undefined,
    });

    return Response.json({
      text: plan.text,
      imagePrompt: plan.imagePrompt,
      lessonOverview: plan.lessonOverview,
      slides: plan.slides || [],
    });
  } catch (error) {
    console.error('Lesson plan generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate lesson plan.';
    if (message.includes('Gemini API key')) {
      return Response.json({ error: message }, { status: 500 });
    }
    return Response.json({ error: 'Failed to generate lesson plan.' }, { status: 500 });
  }
}
