'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
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
