import { NextRequest } from 'next/server';
import { db, lessonPlans } from '@/lib/db';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';
import { deleteImage } from '@/lib/storage';

function getSlideImageKeys(parameters: unknown): string[] {
  if (!parameters || typeof parameters !== 'object') {
    return [];
  }

  const maybeKeys = (parameters as Record<string, unknown>).slideImageKeys;
  if (!Array.isArray(maybeKeys)) {
    return [];
  }

  return maybeKeys
    .filter((key): key is string => typeof key === 'string' && key.trim().length > 0)
    .map((key) => key.trim());
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id } = await params;
    const plan = await db.query.lessonPlans.findFirst({
      where: and(eq(lessonPlans.id, id), eq(lessonPlans.userId, authUser.id)),
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
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields: Record<string, any> = {};
    if (body.title !== undefined) allowedFields.title = body.title;
    if (body.content !== undefined) allowedFields.content = body.content;
    if (body.planLength !== undefined) allowedFields.planLength = body.planLength;
    if (body.gradeLevel !== undefined) allowedFields.gradeLevel = body.gradeLevel;
    if (body.subject !== undefined) allowedFields.subject = body.subject;
    if (body.duration !== undefined) allowedFields.duration = body.duration;
    if (body.imagePrompt !== undefined) allowedFields.imagePrompt = body.imagePrompt;
    if (body.parameters !== undefined) allowedFields.parameters = body.parameters;
    if (body.classRosterId !== undefined) allowedFields.classRosterId = body.classRosterId;
    allowedFields.updatedAt = new Date();

    const updated = await db
      .update(lessonPlans)
      .set(allowedFields)
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.userId, authUser.id)))
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
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id } = await params;
    const plan = await db.query.lessonPlans.findFirst({
      where: and(eq(lessonPlans.id, id), eq(lessonPlans.userId, authUser.id)),
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

    const slideImageKeys = Array.from(new Set(
      getSlideImageKeys(plan.parameters).filter((key) => key.startsWith(`lesson-plans/${authUser.id}/`))
    ));
    for (const slideImageKey of slideImageKeys) {
      try {
        await deleteImage(slideImageKey);
      } catch (e) {
        console.error('Failed to delete slide image from storage:', e);
      }
    }

    await db
      .delete(lessonPlans)
      .where(and(eq(lessonPlans.id, id), eq(lessonPlans.userId, authUser.id)));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Lesson plan delete error:', error);
    return Response.json({ error: 'Failed to delete lesson plan' }, { status: 500 });
  }
}
