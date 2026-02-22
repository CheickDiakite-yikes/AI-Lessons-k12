import { NextRequest } from 'next/server';
import { downloadImage } from '@/lib/storage';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    const isOwnProfile = decodedKey.startsWith(`users/${authUser.id}/`);
    const isOwnLesson = decodedKey.startsWith(`lesson-plans/${authUser.id}/`);

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
