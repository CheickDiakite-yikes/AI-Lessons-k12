import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-whisper-white)] font-sans text-[var(--color-deep-ink)] flex flex-col">
      <PublicNav />
      <main className="flex-1 md:py-24 md:px-6 max-w-4xl mx-auto w-full">
        <div className="bg-[var(--color-crisp-page)] border-b-4 md:border-4 border-[var(--color-deep-ink)] p-6 md:p-12 md:shadow-[8px_8px_0px_0px_var(--color-deep-ink)]">
          <h1 className="text-5xl font-serif font-black mb-8 uppercase">Privacy Policy</h1>
          <div className="space-y-6 text-lg text-[var(--color-charcoal-grey)] font-medium leading-relaxed">
            <p>Last updated: February 21, 2026</p>
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, build a roster, or generate a lesson plan. This includes your name, email address, and the educational data you input.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. Specifically, student roster data is used strictly to generate contextualized lesson plans.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">3. Data Security & AI</h2>
            <p>Your student data is never used to train public AI models. We use enterprise-grade APIs that do not retain your data for training purposes. We implement appropriate technical and organizational measures to protect your personal data.</p>
            
            <h2 className="text-2xl font-black text-[var(--color-deep-ink)] mt-8 mb-4 uppercase">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@lessoncraft.com.</p>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
