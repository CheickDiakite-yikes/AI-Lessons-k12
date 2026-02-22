import { NextRequest } from 'next/server';
import { generateImageServer } from '@/lib/ai-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
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
