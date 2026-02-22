import { NextRequest } from 'next/server';
import { db, classRosters } from '@/lib/db';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const rosters = await db.query.classRosters.findMany({
      where: eq(classRosters.userId, authUser.id),
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
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return Response.json({ error: 'Name is required' }, { status: 400 });
    }

    const inserted = await db
      .insert(classRosters)
      .values({ userId: authUser.id, name: name.trim() })
      .returning();

    return Response.json({ ...inserted[0], students: [] }, { status: 201 });
  } catch (error) {
    console.error('Class roster create error:', error);
    return Response.json({ error: 'Failed to create roster' }, { status: 500 });
  }
}
