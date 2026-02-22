import { NextRequest } from 'next/server';
import { db, users } from '@/lib/db';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { name, role, school, howDidYouHear } = body;

    const existing = await db.query.users.findFirst({
      where: eq(users.firebaseUid, decoded.uid),
    });

    if (existing) {
      const updated = await db
        .update(users)
        .set({
          email: decoded.email || existing.email,
          name: name || existing.name,
          role: role || existing.role,
          school: school !== undefined ? school : existing.school,
          howDidYouHear: howDidYouHear !== undefined ? howDidYouHear : existing.howDidYouHear,
          updatedAt: new Date(),
        })
        .where(eq(users.firebaseUid, decoded.uid))
        .returning();

      return Response.json(updated[0]);
    }

    const inserted = await db
      .insert(users)
      .values({
        firebaseUid: decoded.uid,
        email: decoded.email || '',
        name: name || decoded.name || 'User',
        role: role || 'teacher',
        school: school || null,
        howDidYouHear: howDidYouHear || null,
      })
      .returning();

    return Response.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error('User sync error:', error);
    return Response.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.firebaseUid, decoded.uid),
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
