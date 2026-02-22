import { getAuthUser, unauthorizedResponse } from '@/lib/auth-server';

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) return unauthorizedResponse();

  try {
    return Response.json(authUser);
  } catch (error) {
    console.error('User fetch error:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
