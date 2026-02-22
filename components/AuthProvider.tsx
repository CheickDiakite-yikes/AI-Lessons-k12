'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any;
  loading: boolean;
  dbUserId: string | null;
  signOut: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();
  return {
    user: session?.user || null,
    loading: status === 'loading',
    dbUserId: session?.user?.dbId || null,
    signOut: () => signOut({ callbackUrl: '/' }),
  };
}
