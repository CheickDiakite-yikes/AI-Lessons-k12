import { NextRequest } from 'next/server';
import { generateImageServer } from '@/lib/ai-server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return unauthorizedResponse();

    const rl = rateLimit(`ai-img:${authUser.id}`, { maxRequests: 20, windowMs: 60_000 });
    if (!rl.success) {
      return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Image prompt is required.' }, { status: 400 });
    }

    const imageBase64 = await generateImageServer(prompt);
    return Response.json({ imageBase64 });
  } catch (error) {
    console.error('Image generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate image.';
    if (message.includes('Gemini API key')) {
      return Response.json({ error: message }, { status: 500 });
    }
    return Response.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
