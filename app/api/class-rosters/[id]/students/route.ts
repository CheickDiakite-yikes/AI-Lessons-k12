import { NextRequest } from 'next/server';
import { db, users, classRosters, students } from '@/lib/db';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { eq, and } from 'drizzle-orm';

async function verifyRosterOwnership(firebaseUid: string, rosterId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.firebaseUid, firebaseUid),
    columns: { id: true },
  });
  if (!user) return false;

  const roster = await db.query.classRosters.findFirst({
    where: and(eq(classRosters.id, rosterId), eq(classRosters.userId, user.id)),
  });
  return !!roster;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const { id: rosterId } = await params;
    const isOwner = await verifyRosterOwnership(decoded.uid, rosterId);
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
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const { id: rosterId } = await params;
    const isOwner = await verifyRosterOwnership(decoded.uid, rosterId);
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
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const { id: rosterId } = await params;
    const isOwner = await verifyRosterOwnership(decoded.uid, rosterId);
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
