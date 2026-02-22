import { NextRequest } from 'next/server';
import { db, users, lessonPlans } from '@/lib/db';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';
import { deleteImage } from '@/lib/storage';

async function getUserId(firebaseUid: string): Promise<string | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.firebaseUid, firebaseUid),
    columns: { id: true },
  });
  return user?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const { id } = await params;
    const plan = await db.query.lessonPlans.findFirst({
      where: and(eq(lessonPlans.id, id), eq(lessonPlans.userId, userId)),
    });

    if (!plan) {
      return Response.json({ error: 'Lesson plan not found' }, { status: 404 });
    }

    return Response.json(plan);
  } catch (error) {
    console.error('Lesson plan fetch error:', error);
    return Response.json({ error: 'Failed to fetch lesson plan' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(lessonPlans)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.userId, userId)))
      .returning();

    if (!updated.length) {
      return Response.json({ error: 'Lesson plan not found' }, { status: 404 });
    }

    return Response.json(updated[0]);
  } catch (error) {
    console.error('Lesson plan update error:', error);
    return Response.json({ error: 'Failed to update lesson plan' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const { id } = await params;
    const plan = await db.query.lessonPlans.findFirst({
      where: and(eq(lessonPlans.id, id), eq(lessonPlans.userId, userId)),
    });

    if (!plan) {
      return Response.json({ error: 'Lesson plan not found' }, { status: 404 });
    }

    if (plan.imageKey) {
      try {
        await deleteImage(plan.imageKey);
      } catch (e) {
        console.error('Failed to delete image from storage:', e);
      }
    }

    await db
      .delete(lessonPlans)
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.userId, userId)));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Lesson plan delete error:', error);
    return Response.json({ error: 'Failed to delete lesson plan' }, { status: 500 });
  }
}
