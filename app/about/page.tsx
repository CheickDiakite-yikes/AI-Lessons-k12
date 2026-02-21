'use client';
import { motion } from 'motion/react';
import { PublicNav } from '@/components/PublicNav';
import { PublicFooter } from '@/components/PublicFooter';
import { Users, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-whisper-white)] font-sans text-[var(--color-deep-ink)] overflow-x-hidden flex flex-col">
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-[var(--color-gold-star)] border-4 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[4px_4px_0px_0px_var(--color-deep-ink)]"
          >
            <Heart className="w-12 h-12 text-[var(--color-deep-ink)]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-serif font-black uppercase mb-8 leading-[0.9]"
          >
            Built for <span className="text-[var(--color-sage-green)]">Teachers</span>,<br/>by Teachers.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-[var(--color-charcoal-grey)] font-medium max-w-3xl mx-auto leading-relaxed"
          >
            We believe that every student deserves a tailored education, and every teacher deserves the time to actually teach.
          </motion.p>
        </section>

        {/* Values */}
        <section className="py-24 px-6 bg-[var(--color-soft-clay)] border-y-4 border-[var(--color-deep-ink)] relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-5xl font-serif font-black mb-16 text-center uppercase">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Empathy First", desc: "We know the burnout is real. Our tools are designed to reduce cognitive load, not add to it.", color: "bg-[var(--color-blush-pink)]" },
                { icon: Users, title: "Radical Inclusion", desc: "Differentiation shouldn't be an afterthought. We build it into the core of every lesson plan.", color: "bg-[var(--color-sage-green)]" },
                { icon: Sparkles, title: "AI as an Assistant", desc: "AI shouldn't replace teachers. It should be the ultimate teaching assistant, amplifying your expertise.", color: "bg-[var(--color-gold-star)]" }
              ].map((val, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-[var(--color-crisp-page)] border-4 border-[var(--color-deep-ink)] p-8 shadow-[8px_8px_0px_0px_var(--color-deep-ink)]"
                >
                  <div className={`w-16 h-16 ${val.color} border-4 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_var(--color-deep-ink)]`}>
                    <val.icon className={`w-8 h-8 ${val.color === 'bg-[var(--color-sage-green)]' ? 'text-white' : 'text-[var(--color-deep-ink)]'}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase">{val.title}</h3>
                  <p className="text-[var(--color-charcoal-grey)] font-medium leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--color-whisper-white)] border-4 border-[var(--color-deep-ink)] rounded-full opacity-50"
          />
        </section>

        {/* The Mission */}
        <section className="py-24 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-serif font-black mb-8 uppercase">The Mission</h2>
          <p className="text-2xl text-[var(--color-charcoal-grey)] font-medium leading-relaxed mb-8">
            Lesson planning is broken. Teachers spend countless unpaid hours trying to adapt generic curriculum to fit the beautifully diverse needs of their actual students. 
          </p>
          <p className="text-2xl text-[var(--color-charcoal-grey)] font-medium leading-relaxed">
            We built LessonCraft to bridge the gap between high-level curriculum goals and the reality of a modern classroom. By combining deep roster context with advanced AI, we're giving teachers their weekends back.
          </p>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
