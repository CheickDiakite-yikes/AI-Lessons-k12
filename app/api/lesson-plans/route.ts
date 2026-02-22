import { NextRequest } from 'next/server';
import { db, lessonPlans } from '@/lib/db';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { desc } from 'drizzle-orm';
import { uploadImage, generateImageKey } from '@/lib/storage';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const plans = await db.query.lessonPlans.findMany({
      where: eq(lessonPlans.userId, authUser.id),
      orderBy: [desc(lessonPlans.createdAt)],
    });

    return Response.json(plans);
  } catch (error) {
    console.error('Lesson plans fetch error:', error);
    return Response.json({ error: 'Failed to fetch lesson plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { title, content, imagePrompt, imageBase64, planLength, gradeLevel, subject, duration, classRosterId, parameters } = body;

    if (!content) {
      return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    let imageKey: string | null = null;
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      imageKey = generateImageKey('lesson', authUser.id);
      await uploadImage(imageKey, buffer);
    }

    const inserted = await db
      .insert(lessonPlans)
      .values({
        userId: authUser.id,
        classRosterId: classRosterId || null,
        title: title || extractTitle(content),
        planLength,
        gradeLevel,
        subject,
        duration,
        content,
        imagePrompt: imagePrompt || null,
        imageKey,
        parameters: parameters || null,
      })
      .returning();

    return Response.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error('Lesson plan create error:', error);
    return Response.json({ error: 'Failed to create lesson plan' }, { status: 500 });
  }
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : 'Untitled Lesson Plan';
}
