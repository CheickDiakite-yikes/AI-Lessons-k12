import { auth } from '@/lib/auth';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.dbId) return null;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.dbId),
  });

  return dbUser || null;
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
