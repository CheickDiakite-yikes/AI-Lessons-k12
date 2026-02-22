import { PublicNavStatic } from '@/components/PublicNavStatic';
import { PublicFooter } from '@/components/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-whisper-white)] font-sans text-[var(--color-deep-ink)] flex flex-col">
      <PublicNavStatic />
      <main className="flex-1 md:py-24 md:px-6 max-w-4xl mx-auto w-full">
        <div className="bg-[var(--color-crisp-page)] border-b-4 md:border-4 border-[var(--color-deep-ink)] p-6 md:p-12 md:shadow-[8px_8px_0px_0px_var(--color-deep-ink)]">
          <h1 className="text-5xl font-serif font-black mb-8 uppercase">Terms of Service</h1>
          <div className="space-y-6 text-lg text-[var(--color-charcoal-grey)] font-medium leading-relaxed">
            <p>Last updated: February 21, 2026</p>
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">1. Acceptance of Terms</h2>
            <p>By accessing or using LessonCraft, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on LessonCraft&apos;s website for personal, non-commercial transitory viewing only.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">3. Disclaimer</h2>
            <p>The materials on LessonCraft&apos;s website are provided on an &apos;as is&apos; basis. LessonCraft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">4. Limitations</h2>
            <p>In no event shall LessonCraft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LessonCraft&apos;s website.</p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
