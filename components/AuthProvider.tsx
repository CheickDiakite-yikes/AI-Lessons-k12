'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getFirebaseAuth, preloadFirebaseAuth } from '@/lib/firebase';

interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'teacher' | 'admin' | 'student';
  school?: string;
  howDidYouHear?: string;
  profileImageKey?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  dbUserId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  dbUserId: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to sync profile:', response.status);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isActive = true;
    let unsubscribe: (() => void) | null = null;

    const bindAuthListener = async () => {
      try {
        await preloadFirebaseAuth();
        const [{ onAuthStateChanged }, auth] = await Promise.all([
          import('firebase/auth'),
          getFirebaseAuth(),
        ]);

        if (!isActive) {
          return;
        }

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!isActive) {
            return;
          }

          setUser(currentUser);
          setLoading(false);

          if (currentUser) {
            // Keep the app interactive while profile sync runs in the background.
            void syncProfile(currentUser);
          } else {
            setProfile(null);
          }
        });
      } catch (error) {
        console.error('Failed to initialize auth state listener:', error);
        if (isActive) {
          setLoading(false);
          setProfile(null);
          setUser(null);
        }
      }
    };

    void bindAuthListener();

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      dbUserId: profile?.id || null,
      refreshProfile: async () => {
        if (user) await syncProfile(user);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
