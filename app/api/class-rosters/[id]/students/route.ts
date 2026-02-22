import { NextRequest } from 'next/server';
import { db, classRosters, students } from '@/lib/db';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';

async function verifyRosterOwnership(userId: string, rosterId: string): Promise<boolean> {
  const roster = await db.query.classRosters.findFirst({
    where: and(eq(classRosters.id, rosterId), eq(classRosters.userId, userId)),
  });
  return !!roster;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id: rosterId } = await params;
    const isOwner = await verifyRosterOwnership(authUser.id, rosterId);
    if (!isOwner) return Response.json({ error: 'Roster not found' }, { status: 404 });

    const body = await request.json();
    const { name, englishProficiency, readingLevel, mathLevel, writingLevel, academicLevel, learningPreference } = body;

    if (!name?.trim()) {
      return Response.json({ error: 'Student name is required' }, { status: 400 });
    }

    const inserted = await db
      .insert(students)
      .values({
        classRosterId: rosterId,
        name: name.trim(),
        englishProficiency: englishProficiency || 'Expanding',
        readingLevel: readingLevel || 'At Grade',
        mathLevel: mathLevel || 'At Grade',
        writingLevel: writingLevel || 'At Grade',
        academicLevel: academicLevel || 'At Grade',
        learningPreference: learningPreference || 'Visual',
      })
      .returning();

    return Response.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error('Student create error:', error);
    return Response.json({ error: 'Failed to create student' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id: rosterId } = await params;
    const isOwner = await verifyRosterOwnership(authUser.id, rosterId);
    if (!isOwner) return Response.json({ error: 'Roster not found' }, { status: 404 });

    const body = await request.json();
    const { studentId, ...updates } = body;

    if (!studentId) {
      return Response.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const updated = await db
      .update(students)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(students.id, studentId), eq(students.classRosterId, rosterId)))
      .returning();

    if (!updated.length) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    return Response.json(updated[0]);
  } catch (error) {
    console.error('Student update error:', error);
    return Response.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { id: rosterId } = await params;
    const isOwner = await verifyRosterOwnership(authUser.id, rosterId);
    if (!isOwner) return Response.json({ error: 'Roster not found' }, { status: 404 });

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    if (!studentId) {
      return Response.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const deleted = await db
      .delete(students)
      .where(and(eq(students.id, studentId), eq(students.classRosterId, rosterId)))
      .returning();

    if (!deleted.length) {
      return Response.json({ error: 'Student not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Student delete error:', error);
    return Response.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
