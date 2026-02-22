import { NextRequest } from 'next/server';
import { db, users, classRosters } from '@/lib/db';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';

async function getUserId(firebaseUid: string): Promise<string | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.firebaseUid, firebaseUid),
    columns: { id: true },
  });
  return user?.id || null;
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
    const { name } = await request.json();

    const updated = await db
      .update(classRosters)
      .set({ name, updatedAt: new Date() })
      .where(and(eq(classRosters.id, id), eq(classRosters.userId, userId)))
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
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const { id } = await params;
    const deleted = await db
      .delete(classRosters)
      .where(and(eq(classRosters.id, id), eq(classRosters.userId, userId)))
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
