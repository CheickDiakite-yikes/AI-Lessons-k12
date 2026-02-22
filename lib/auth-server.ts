import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { NextRequest } from 'next/server';
import firebaseConfig from '../firebase-applet-config.json';

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const adminAuth = getAuth();

export async function verifyFirebaseToken(request: NextRequest): Promise<DecodedIdToken | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return null;
  }
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
