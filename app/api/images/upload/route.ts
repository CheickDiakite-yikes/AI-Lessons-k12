import { NextRequest } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { uploadImage, generateImageKey } from '@/lib/storage';

export const runtime = 'nodejs';

function sanitizeIdentifier(identifier: unknown): string | undefined {
  if (typeof identifier !== 'string') {
    return undefined;
  }

  const trimmed = identifier.trim().toLowerCase();
  if (!trimmed) {
    return undefined;
  }

  const safe = trimmed.replace(/[^a-z0-9-_]/g, '-').slice(0, 48);
  return safe.length > 0 ? safe : undefined;
}

export async function POST(request: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { imageBase64, identifier } = body ?? {};

    if (typeof imageBase64 !== 'string' || !imageBase64.trim()) {
      return Response.json({ error: 'imageBase64 is required' }, { status: 400 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    if (!buffer.length) {
      return Response.json({ error: 'Invalid image payload' }, { status: 400 });
    }

    const safeIdentifier = sanitizeIdentifier(identifier);
    const imageKey = generateImageKey('lesson', authUser.id, safeIdentifier);
    await uploadImage(imageKey, buffer);

    return Response.json({ imageKey });
  } catch (error) {
    console.error('Slide image upload error:', error);
    return Response.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

