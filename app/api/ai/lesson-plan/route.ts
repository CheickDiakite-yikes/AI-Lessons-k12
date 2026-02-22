import { NextRequest } from 'next/server';
import { generateLessonPlanServer } from '@/lib/ai-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
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

    return Response.json(plan);
  } catch (error) {
    console.error('Lesson plan generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate lesson plan.';
    if (message.includes('Gemini API key')) {
      return Response.json({ error: message }, { status: 500 });
    }
    return Response.json({ error: 'Failed to generate lesson plan.' }, { status: 500 });
  }
}
