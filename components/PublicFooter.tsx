import Link from 'next/link';
import { CustomLogo } from './CustomLogo';

export function PublicFooter() {
  return (
    <footer className="bg-[var(--color-deep-ink)] text-white py-16 px-6 border-t-4 border-black mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 bg-[var(--color-sage-green)] border-2 border-white rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
              <CustomLogo className="w-7 h-7 text-white group-hover:text-[var(--color-sage-green)] transition-colors" />
            </div>
            <span className="text-3xl font-serif font-black tracking-tight text-white">Lesson<span className="text-[var(--color-sage-green)]">Craft</span></span>
          </Link>
          <p className="text-[var(--color-concrete-light)] text-lg font-medium max-w-sm mb-8 leading-relaxed">
            Empowering educators with AI-driven, highly differentiated lesson planning. Craft lessons, not stress.
          </p>
          <p className="text-[var(--color-charcoal-grey)] font-mono text-sm">
            © 2026 LessonCraft. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-col items-start gap-4">
          <h3 className="font-bold text-xl mb-2 uppercase tracking-wider text-[var(--color-sage-green)]">Company</h3>
          <Link href="/about" className="hover:text-[var(--color-sage-green)] transition-colors font-bold text-lg">About Us</Link>
          <a href="mailto:hello@lessoncraft.com" className="hover:text-[var(--color-sage-green)] transition-colors font-bold text-lg">Contact</a>
        </div>

        <div className="flex flex-col items-start gap-4">
          <h3 className="font-bold text-xl mb-2 uppercase tracking-wider text-[var(--color-sage-green)]">Legal</h3>
          <Link href="/privacy" className="hover:text-[var(--color-sage-green)] transition-colors font-bold text-lg">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[var(--color-sage-green)] transition-colors font-bold text-lg">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
