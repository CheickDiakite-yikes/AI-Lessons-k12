import { NextRequest } from 'next/server';
import { db, users, classRosters } from '@/lib/db';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { eq } from 'drizzle-orm';

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

    const rosters = await db.query.classRosters.findMany({
      where: eq(classRosters.userId, userId),
      with: { students: true },
      orderBy: (r, { asc }) => [asc(r.createdAt)],
    });

    return Response.json(rosters);
  } catch (error) {
    console.error('Class rosters fetch error:', error);
    return Response.json({ error: 'Failed to fetch rosters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const userId = await getUserId(decoded.uid);
    if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

    const { name } = await request.json();
    if (!name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    const inserted = await db
      .insert(classRosters)
      .values({ userId, name: name.trim() })
      .returning();

    return Response.json({ ...inserted[0], students: [] }, { status: 201 });
  } catch (error) {
    console.error('Class roster create error:', error);
    return Response.json({ error: 'Failed to create roster' }, { status: 500 });
  }
}
