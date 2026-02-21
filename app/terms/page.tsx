import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-whisper-white)] font-sans text-[var(--color-deep-ink)] flex flex-col">
      <PublicNav />
      <main className="flex-1 py-24 px-6 max-w-4xl mx-auto w-full">
        <div className="bg-[var(--color-crisp-page)] border-4 border-[var(--color-deep-ink)] p-8 md:p-12 shadow-[8px_8px_0px_0px_var(--color-deep-ink)]">
          <h1 className="text-5xl font-serif font-black mb-8 uppercase">Terms of Service</h1>
          <div className="space-y-6 text-lg text-[var(--color-charcoal-grey)] font-medium leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">1. Acceptance of Terms</h2>
            <p>By accessing or using LessonCraft, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on LessonCraft's website for personal, non-commercial transitory viewing only.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">3. Disclaimer</h2>
            <p>The materials on LessonCraft's website are provided on an 'as is' basis. LessonCraft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">4. Limitations</h2>
            <p>In no event shall LessonCraft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on LessonCraft's website.</p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
