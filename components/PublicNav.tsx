'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomLogo } from './CustomLogo';
import { useAuth } from '@/components/AuthProvider';

export function PublicNav({ onLaunch }: { onLaunch?: () => void }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/login');
    router.prefetch('/signup');
  }, [router]);

  return (
    <nav className="px-3 py-4 sm:p-6 border-b-4 border-[var(--color-deep-ink)] bg-[var(--color-crisp-page)] flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--color-sage-green)] border-2 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-deep-ink)]">
          <CustomLogo className="w-6 h-6 text-white" />
        </div>
        <span className="text-lg sm:text-2xl font-serif font-black tracking-tight text-[var(--color-deep-ink)]">Lesson<span className="text-[var(--color-sage-green)]">Craft</span></span>
      </Link>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {!loading && (
          <>
            {user ? (
              <>
                {onLaunch ? (
                  <button
                    onClick={onLaunch}
                    className="text-sm sm:text-base text-[var(--color-deep-ink)] font-bold hover:underline"
                  >
                    Launch App
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="text-sm sm:text-base text-[var(--color-deep-ink)] font-bold hover:underline"
                  >
                    Launch App
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="bg-[var(--color-deep-ink)] text-white px-3 py-1.5 sm:px-6 sm:py-2 font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-sage-green)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-sage-green)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  prefetch={true}
                  className="text-sm sm:text-base text-[var(--color-deep-ink)] font-bold hover:underline"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  prefetch={true}
                  className="bg-[var(--color-sage-green)] text-white px-3 py-1.5 sm:px-6 sm:py-2 font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none inline-block"
                >
                  Sign Up
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
