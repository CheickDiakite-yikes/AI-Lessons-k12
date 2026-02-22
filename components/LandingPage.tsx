'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Users, Printer, Star, ChevronDown, CheckCircle2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PublicNav } from './PublicNav';
import { PublicFooter } from './PublicFooter';

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Prime key auth routes for near-instant transitions from the landing page.
    router.prefetch('/login');
    router.prefetch('/signup');
  }, [router]);

  const faqs = [
    {
      question: "How does the AI differentiation work?",
      answer: "Our AI analyzes your class roster, taking into account each student's English proficiency, reading/math levels, and learning preferences to automatically suggest differentiated activities and scaffolding."
    },
    {
      question: "Can I export my lesson plans?",
      answer: "Yes! You can export any generated lesson plan as a beautifully formatted PDF, ready to print or share with administrators."
    },
    {
      question: "Is my student data secure?",
      answer: "Absolutely. Student data is only used temporarily to generate the lesson plan context and is never stored permanently on our servers or used to train public AI models."
    },
    {
      question: "Can I edit the generated plans?",
      answer: "The generated plans are a starting point. While the current version provides a solid foundation, future updates will include full rich-text editing capabilities."
    }
  ];

  const testimonials = [
    {
      quote: "This tool has saved me hours of planning every week. The differentiation suggestions are spot-on for my diverse classroom.",
      author: "Sarah J.",
      role: "5th Grade Teacher"
    },
    {
      quote: "Finally, a lesson planner that actually understands the complexities of an ESL classroom. The roster integration is a game-changer.",
      author: "Michael T.",
      role: "Middle School ESL"
    },
    {
      quote: "The PDF exports look so professional. My principal was incredibly impressed with the level of detail in my weekly plans.",
      author: "Elena R.",
      role: "High School Science"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-whisper-white)] font-sans text-[var(--color-deep-ink)] overflow-x-hidden flex flex-col">
      {/* Navigation */}
      <PublicNav onLaunch={onLaunch} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif font-black leading-[0.9] tracking-tighter mb-6 uppercase">
              Craft Lessons.<br/>
              <span className="text-[var(--color-sage-green)] relative inline-block">
                Not Stress.
                <motion.svg 
                  className="absolute -bottom-4 left-0 w-full h-4 text-[var(--color-gold-star)]" 
                  viewBox="0 0 100 10" 
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </motion.svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-charcoal-grey)] mb-10 max-w-2xl mx-auto font-medium">
              The AI-powered lesson planner that actually understands your classroom. Build highly differentiated, engaging plans in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onLaunch}
                className="w-full sm:w-auto bg-[var(--color-sage-green)] text-white px-8 py-4 text-xl font-bold border-4 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[8px] active:translate-x-[8px] active:shadow-none flex items-center justify-center gap-3"
              >
                Start Planning Free <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-24 h-24 bg-[var(--color-blush-pink)] border-4 border-[var(--color-deep-ink)] rounded-full -z-10 opacity-50 hidden md:block"
        />
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-[var(--color-gold-star)] border-4 border-[var(--color-deep-ink)] -z-10 opacity-50 hidden md:block transform rotate-12"
        />
      </section>

      {/* Social Proof Carousel */}
      <section className="py-10 border-y-4 border-[var(--color-deep-ink)] bg-[var(--color-soft-clay)] overflow-hidden">
        <p className="text-center font-bold uppercase tracking-widest text-sm mb-6 text-[var(--color-charcoal-grey)]">Trusted by forward-thinking educators at</p>
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 px-8 items-center">
              <span className="text-2xl font-serif font-black opacity-50">OAKRIDGE ACADEMY</span>
              <span className="text-2xl font-serif font-black opacity-50">LINCOLN HIGH</span>
              <span className="text-2xl font-serif font-black opacity-50">MONTESSORI PREP</span>
              <span className="text-2xl font-serif font-black opacity-50">WESTSIDE ELEMENTARY</span>
              <span className="text-2xl font-serif font-black opacity-50">GLOBAL SCHOLARS</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-black mb-4 uppercase">How It Works</h2>
          <p className="text-xl text-[var(--color-charcoal-grey)]">Three simple steps to your perfect lesson plan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "1. Build Your Roster", desc: "Input your students' reading levels, English proficiency, and learning styles once.", color: "bg-[var(--color-blush-pink)]" },
            { icon: Sparkles, title: "2. Set Objectives", desc: "Tell the AI what you want to teach, or let it auto-generate objectives based on your subject and grade.", color: "bg-[var(--color-gold-star)]" },
            { icon: Printer, title: "3. Generate & Teach", desc: "Get a beautifully formatted, highly differentiated lesson plan ready to print or share.", color: "bg-[var(--color-sage-green)]" }
          ].map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-[var(--color-crisp-page)] border-4 border-[var(--color-deep-ink)] p-8 shadow-[8px_8px_0px_0px_var(--color-deep-ink)] relative"
            >
              <div className={`w-16 h-16 ${step.color} border-4 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_var(--color-deep-ink)] absolute -top-8 -left-4`}>
                <step.icon className="w-8 h-8 text-[var(--color-deep-ink)]" />
              </div>
              <h3 className="text-2xl font-black mb-4 mt-4">{step.title}</h3>
              <p className="text-[var(--color-charcoal-grey)] font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-[var(--color-deep-ink)] text-white border-y-4 border-[var(--color-deep-ink)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-serif font-black mb-8 uppercase text-[var(--color-whisper-white)]">Differentiated by Design.</h2>
              <div className="space-y-6">
                {[
                  "Deep Roster Integration for personalized activities",
                  "Support for ESL and diverse academic levels",
                  "Customizable lesson lengths (Single to Semester)",
                  "Beautiful PDF exports for your records",
                  "AI-generated visual aids and prompts"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[var(--color-sage-green)] border-2 border-white rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={onLaunch}
                className="mt-10 bg-[var(--color-gold-star)] text-[var(--color-deep-ink)] px-8 py-4 text-xl font-bold border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all active:translate-y-[8px] active:translate-x-[8px] active:shadow-none"
              >
                Try It Now
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-sage-green)] translate-x-4 translate-y-4 border-4 border-white"></div>
              <div className="relative bg-[var(--color-crisp-page)] border-4 border-white p-6 h-[500px] flex flex-col">
                <div className="flex items-center justify-between border-b-4 border-[var(--color-deep-ink)] pb-4 mb-4">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-[var(--color-deep-ink)]"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-[var(--color-deep-ink)]"></div>
                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--color-deep-ink)]"></div>
                  </div>
                  <span className="font-mono text-[var(--color-deep-ink)] font-bold">Lesson_Plan.pdf</span>
                </div>
                <div className="flex-1 bg-[var(--color-whisper-white)] border-2 border-[var(--color-deep-ink)] p-4 overflow-hidden relative">
                  <div className="w-3/4 h-8 bg-[var(--color-concrete-light)] mb-4"></div>
                  <div className="w-full h-4 bg-[var(--color-concrete-light)] mb-2"></div>
                  <div className="w-5/6 h-4 bg-[var(--color-concrete-light)] mb-6"></div>
                  
                  <div className="w-1/2 h-6 bg-[var(--color-blush-pink)] mb-4"></div>
                  <div className="w-full h-24 bg-[var(--color-soft-clay)] border-2 border-[var(--color-deep-ink)] mb-4"></div>
                  
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-[var(--color-gold-star)] rounded-full border-2 border-[var(--color-deep-ink)] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[var(--color-deep-ink)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-serif font-black mb-16 text-center uppercase">Wall of Love</h2>
        </div>
        <div className="relative w-full overflow-hidden pb-8">
          <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex gap-6 md:gap-8 px-3 md:px-4">
                {testimonials.map((t, i) => (
                  <div key={`${arrayIndex}-${i}`} className="w-[85vw] sm:w-[400px] bg-[var(--color-whisper-white)] border-4 border-[var(--color-deep-ink)] p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--color-deep-ink)] shrink-0 whitespace-normal flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 md:w-6 md:h-6 fill-[var(--color-gold-star)] text-[var(--color-deep-ink)]" />)}
                      </div>
                      <p className="text-lg md:text-xl font-medium mb-8 leading-relaxed">&quot;{t.quote}&quot;</p>
                    </div>
                    <div className="flex items-center gap-4 border-t-4 border-[var(--color-deep-ink)] pt-4 mt-auto">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[var(--color-sage-green)] border-2 border-[var(--color-deep-ink)] rounded-full flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-base md:text-lg">{t.author}</p>
                        <p className="text-[var(--color-charcoal-grey)] font-mono text-xs md:text-sm">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-[var(--color-soft-clay)] border-t-4 border-[var(--color-deep-ink)]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-serif font-black mb-12 text-center uppercase">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[var(--color-crisp-page)] border-4 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] overflow-hidden">
                <button 
                  className="w-full p-6 text-left flex justify-between items-center font-bold text-xl hover:bg-[var(--color-whisper-white)] transition-colors"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  {faq.question}
                  <ChevronDown className={`w-6 h-6 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-[var(--color-charcoal-grey)] font-medium border-t-4 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
