import { NextRequest } from 'next/server';
import { downloadImage } from '@/lib/storage';
import { verifyFirebaseToken, unauthorizedResponse } from '@/lib/auth-server';
import { db, users, lessonPlans } from '@/lib/db';
import { eq, or } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const decoded = await verifyFirebaseToken(request);
  if (!decoded) return unauthorizedResponse();

  try {
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    const user = await db.query.users.findFirst({
      where: eq(users.firebaseUid, decoded.uid),
      columns: { id: true },
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const isOwnProfile = decodedKey.startsWith(`users/${user.id}/`);
    const isOwnLesson = decodedKey.startsWith(`lesson-plans/${user.id}/`);

    if (!isOwnProfile && !isOwnLesson) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const buffer = await downloadImage(decodedKey);
    const body = new Uint8Array(buffer);

    return new Response(body, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Image fetch error:', error);
    return Response.json({ error: 'Image not found' }, { status: 404 });
  }
}
