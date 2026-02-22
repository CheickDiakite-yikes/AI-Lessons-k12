import { NextRequest } from 'next/server';
import { db, users, lessonPlans } from '@/lib/db';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { eq, desc } from 'drizzle-orm';
import { uploadImage, generateImageKey } from '@/lib/storage';

async function getUserId(firebaseUid: string): Promise<string | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.firebaseUid, firebaseUid),
    columns: { id: true },
  });
  return user?.id || null;
}

export async function GET(request: NextRequest) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const plans = await db.query.lessonPlans.findMany({
      where: eq(lessonPlans.userId, userId),
      orderBy: [desc(lessonPlans.createdAt)],
    });

    return Response.json(plans);
  } catch (error) {
    console.error('Lesson plans fetch error:', error);
    return Response.json({ error: 'Failed to fetch lesson plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { title, content, imagePrompt, imageBase64, planLength, gradeLevel, subject, duration, classRosterId, parameters } = body;

    if (!content) {
      return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    let imageKey: string | null = null;
    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      imageKey = generateImageKey('lesson', userId);
      await uploadImage(imageKey, buffer);
    }

    const inserted = await db
      .insert(lessonPlans)
      .values({
        userId,
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
