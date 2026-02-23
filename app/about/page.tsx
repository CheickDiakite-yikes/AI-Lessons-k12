import { Heart, Sparkles, Users } from 'lucide-react';
import { PublicNavStatic } from '@/components/PublicNavStatic';
import { PublicFooter } from '@/components/PublicFooter';

const coreValues = [
  {
    icon: Heart,
    title: 'Empathy First',
    description: 'We know the burnout is real. Our tools are designed to reduce cognitive load, not add to it.',
    colorClass: 'bg-[var(--color-blush-pink)]',
    iconColorClass: 'text-[var(--color-deep-ink)]',
  },
  {
    icon: Users,
    title: 'Radical Inclusion',
    description: "Differentiation shouldn't be an afterthought. We build it into the core of every lesson plan.",
    colorClass: 'bg-[var(--color-sage-green)]',
    iconColorClass: 'text-white',
  },
  {
    icon: Sparkles,
    title: 'AI as an Assistant',
    description: "AI shouldn't replace teachers. It should be the ultimate teaching assistant, amplifying your expertise.",
    colorClass: 'bg-[var(--color-gold-star)]',
    iconColorClass: 'text-[var(--color-deep-ink)]',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--color-whisper-white)] font-sans text-[var(--color-deep-ink)] overflow-x-hidden flex flex-col">
      <PublicNavStatic />
      <main className="flex-1">
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          <div className="w-24 h-24 bg-[var(--color-gold-star)] border-4 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_var(--color-deep-ink)]">
            <Heart className="w-12 h-12 text-[var(--color-deep-ink)]" />
          </div>
          <h1 className="text-[clamp(2.35rem,11vw,5.5rem)] font-serif font-black uppercase mb-8 leading-[0.9]">
            Built for <span className="text-[var(--color-sage-green)]">Teachers</span>,<br/>by Teachers.
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-[var(--color-charcoal-grey)] font-medium max-w-3xl mx-auto leading-relaxed">
            We believe that every student deserves a tailored education, and every teacher deserves the time to actually teach.
          </p>
        </section>

        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-[var(--color-soft-clay)] border-y-4 border-[var(--color-deep-ink)] relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black mb-16 text-center uppercase">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coreValues.map((value) => (
                <article
                  key={value.title}
                  className="bg-[var(--color-crisp-page)] border-4 border-[var(--color-deep-ink)] p-6 sm:p-8 shadow-[8px_8px_0px_0px_var(--color-deep-ink)]"
                >
                  <div className={`w-16 h-16 ${value.colorClass} border-4 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_var(--color-deep-ink)]`}>
                    <value.icon className={`w-8 h-8 ${value.iconColorClass}`} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-4 uppercase">{value.title}</h3>
                  <p className="text-[var(--color-charcoal-grey)] font-medium leading-relaxed">{value.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-whisper-white)] border-4 border-[var(--color-deep-ink)] rounded-full opacity-50" />
        </section>

        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black mb-8 uppercase">The Mission</h2>
          <p className="text-base sm:text-lg md:text-2xl text-[var(--color-charcoal-grey)] font-medium leading-relaxed mb-8">
            Lesson planning is broken. Teachers spend countless unpaid hours trying to adapt generic curriculum to fit the beautifully diverse needs of their actual students. 
          </p>
          <p className="text-base sm:text-lg md:text-2xl text-[var(--color-charcoal-grey)] font-medium leading-relaxed">
            We built LessonCraft to bridge the gap between high-level curriculum goals and the reality of a modern classroom. By combining deep roster context with advanced AI, we&apos;re giving teachers their weekends back.
          </p>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
