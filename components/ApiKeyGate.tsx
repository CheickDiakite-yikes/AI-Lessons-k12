'use client';

import { useState, useEffect } from 'react';

export function ApiKeyGate({ children }: { children: React.ReactNode }) {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window !== 'undefined' && window.aistudio && window.aistudio.hasSelectedApiKey) {
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasKey(keySelected);
      } else {
        // If not running in AI Studio, just proceed (or assume no key)
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (typeof window !== 'undefined' && window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success to avoid race condition
      setHasKey(true);
    }
  };

  if (hasKey === null) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--color-whisper-white)]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-[var(--color-sage-green)] h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-[var(--color-sage-green)] rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-[var(--color-sage-green)] rounded col-span-2"></div>
                <div className="h-2 bg-[var(--color-sage-green)] rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-[var(--color-sage-green)] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[var(--color-whisper-white)] p-4">
        <div className="bg-[var(--color-soft-clay)] p-8 rounded-xl border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] max-w-md text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-[var(--color-deep-ink)]">API Key Required</h1>
          <p className="mb-6 text-[var(--color-charcoal-grey)]">
            This application uses the Gemini 3 Pro Image Preview model, which requires a paid Google Cloud project API key.
          </p>
          <button
            onClick={handleSelectKey}
            className="bg-[var(--color-sage-green)] text-white px-6 py-3 rounded-lg font-bold border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
