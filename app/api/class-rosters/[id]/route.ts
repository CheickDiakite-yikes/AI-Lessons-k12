import { NextRequest } from 'next/server';
import { db, classRosters } from '@/lib/db';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id } = await params;
    const { name } = await request.json();

    const updated = await db
      .update(classRosters)
      .set({ name, updatedAt: new Date() })
      .where(and(eq(classRosters.id, id), eq(classRosters.userId, authUser.id)))
      .returning();

    if (!updated.length) {
      return Response.json({ error: 'Roster not found' }, { status: 404 });
    }

    return Response.json(updated[0]);
  } catch (error) {
    console.error('Class roster update error:', error);
    return Response.json({ error: 'Failed to update roster' }, { status: 500 });
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
    const deleted = await db
      .delete(classRosters)
      .where(and(eq(classRosters.id, id), eq(classRosters.userId, authUser.id)))
      .returning();

    if (!deleted.length) {
      return Response.json({ error: 'Roster not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Class roster delete error:', error);
    return Response.json({ error: 'Failed to delete roster' }, { status: 500 });
  }
}
