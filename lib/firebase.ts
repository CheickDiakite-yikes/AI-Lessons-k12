import { initializeApp, getApps, getApp } from 'firebase/app';
import type { Auth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;
let authModulePromise: Promise<typeof import('firebase/auth')> | null = null;

async function getAuthModule() {
  if (!authModulePromise) {
    authModulePromise = import('firebase/auth');
  }
  return authModulePromise;
}

export async function preloadFirebaseAuth() {
  const authModule = await getAuthModule();

  if (!authInstance) {
    authInstance = authModule.getAuth(app);
  }

  if (!googleProviderInstance) {
    googleProviderInstance = new authModule.GoogleAuthProvider();
  }
}

export async function getFirebaseAuth(): Promise<Auth> {
  if (!authInstance) {
    const authModule = await getAuthModule();
    authInstance = authModule.getAuth(app);
  }

  return authInstance as Auth;
}

export async function getGoogleProvider(): Promise<GoogleAuthProvider> {
  if (!googleProviderInstance) {
    const authModule = await getAuthModule();
    googleProviderInstance = new authModule.GoogleAuthProvider();
  }

  return googleProviderInstance as GoogleAuthProvider;
}

export { app };
