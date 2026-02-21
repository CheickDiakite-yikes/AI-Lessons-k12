'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, Save, Printer, Share2, RefreshCw, PenLine, Image as ImageIcon, Menu, X } from 'lucide-react';
import Markdown from 'react-markdown';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
import { generateLessonPlan, generateImage } from '@/lib/ai';

const PLAN_TYPES = ['Single Lesson', '1-4 Weeks', 'One Quarter', 'One Semester'];
const GRADE_LEVELS = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
const SUBJECTS = ['Math', 'Science', 'English/Language Arts', 'Social Studies', 'ESL', 'Art', 'Music', 'Physical Education', 'Special Education'];
const ENGLISH_PROFICIENCY = ['Entering', 'Emerging', 'Developing', 'Expanding', 'Bridging'];
const ACADEMIC_LEVELS = ['Below Grade', 'At Grade', 'Above Grade'];

export function LessonPlanner() {
  const [planType, setPlanType] = useState(PLAN_TYPES[0]);
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[5]);
  const [subject, setSubject] = useState(SUBJECTS[1]);
  const [duration, setDuration] = useState('45');
  const [englishProficiency, setEnglishProficiency] = useState<string[]>(['Expanding']);
  const [academicLevels, setAcademicLevels] = useState<string[]>(['At Grade']);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [manualObjectives, setManualObjectives] = useState('');
  const [isInputPanelOpen, setIsInputPanelOpen] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsInputPanelOpen(false);
    setGeneratedPlan(null);
    setGeneratedImage(null);
    setImagePrompt(null);
    
    try {
      const plan = await generateLessonPlan({
        planType,
        gradeLevel,
        subject,
        duration,
        englishProficiency,
        academicLevels,
        autoGenerate,
        manualObjectives
      });
      
      setGeneratedPlan(plan.text);
      
      if (plan.imagePrompt) {
        setImagePrompt(plan.imagePrompt);
        setIsGeneratingImage(true);
        const image = await generateImage(plan.imagePrompt);
        setGeneratedImage(image);
        setIsGeneratingImage(false);
      }
      
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Failed to generate lesson plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!contentRef.current) return;
    
    const opt = {
      margin:       10,
      filename:     `Lesson_Plan_${subject}_${gradeLevel}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(contentRef.current).save().then(() => {
      triggerConfetti();
    });
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFC0CB', '#6B9E81']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFC0CB', '#6B9E81']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleSave = () => {
    triggerConfetti();
    // In a real app, save to database
  };

  const toggleMultiSelect = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-whisper-white)]">
      {/* Left Panel - Input Journal */}
      <div className={`${isInputPanelOpen ? 'flex' : 'hidden'} md:flex w-full md:w-1/4 bg-[var(--color-soft-clay)] border-r-4 border-[var(--color-deep-ink)] flex-col h-screen sticky top-0 overflow-y-auto shadow-[4px_0px_0px_var(--color-deep-ink)] z-20`}>
        <div className="p-6 border-b-2 border-[var(--color-deep-ink)] bg-[var(--color-soft-clay)] sticky top-0 z-20 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-[var(--color-deep-ink)] flex items-center gap-2">
            <PenLine className="w-6 h-6" />
            The Input Journal
          </h1>
          <button 
            onClick={() => setIsInputPanelOpen(false)}
            className="md:hidden flex items-center justify-center p-2 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
            aria-label="Close input panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-8 flex-1">
          {/* Plan Type */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">Plan Type</label>
            <div className="relative">
              <select 
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                className="w-full appearance-none bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 pr-10 font-sans focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]"
              >
                {PLAN_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none text-[var(--color-deep-ink)]" />
            </div>
          </div>

          {/* Grade Level */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">Grade Level</label>
            <div className="relative">
              <select 
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full appearance-none bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 pr-10 font-sans focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]"
              >
                {GRADE_LEVELS.map(gl => <option key={gl} value={gl}>{gl}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none text-[var(--color-deep-ink)]" />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">Subject</label>
            <div className="relative">
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full appearance-none bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 pr-10 font-sans focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]"
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none text-[var(--color-deep-ink)]" />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">Lesson Duration (mins)</label>
            <input 
              type="number" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 font-sans focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]"
            />
          </div>

          {/* English Proficiency */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">English Proficiency</label>
            <div className="flex flex-wrap gap-2">
              {ENGLISH_PROFICIENCY.map(ep => (
                <button
                  key={ep}
                  onClick={() => toggleMultiSelect(ep, englishProficiency, setEnglishProficiency)}
                  className={`px-3 py-1.5 border-2 border-[var(--color-deep-ink)] text-sm font-bold transition-all ${
                    englishProficiency.includes(ep) 
                      ? 'bg-[var(--color-sage-green)] text-white shadow-[2px_2px_0px_0px_var(--color-deep-ink)] translate-y-[-2px] translate-x-[-2px]' 
                      : 'bg-[var(--color-crisp-page)] text-[var(--color-deep-ink)] hover:bg-[var(--color-soft-clay)]'
                  }`}
                >
                  {ep} {englishProficiency.includes(ep) && '✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Levels */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">Academic Levels</label>
            <div className="flex flex-wrap gap-2">
              {ACADEMIC_LEVELS.map(al => (
                <button
                  key={al}
                  onClick={() => toggleMultiSelect(al, academicLevels, setAcademicLevels)}
                  className={`px-3 py-1.5 border-2 border-[var(--color-deep-ink)] text-sm font-bold transition-all ${
                    academicLevels.includes(al) 
                      ? 'bg-[var(--color-sage-green)] text-white shadow-[2px_2px_0px_0px_var(--color-deep-ink)] translate-y-[-2px] translate-x-[-2px]' 
                      : 'bg-[var(--color-crisp-page)] text-[var(--color-deep-ink)] hover:bg-[var(--color-soft-clay)]'
                  }`}
                >
                  {al} {academicLevels.includes(al) && '✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Generate Toggle */}
          <div className="flex items-center justify-between p-4 border-2 border-[var(--color-deep-ink)] bg-[var(--color-crisp-page)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-gold-star)]" />
              <span className="font-bold text-[var(--color-deep-ink)] text-sm">Auto-Generate Objectives</span>
            </div>
            <button 
              onClick={() => setAutoGenerate(!autoGenerate)}
              className={`w-12 h-6 rounded-full border-2 border-[var(--color-deep-ink)] relative transition-colors ${autoGenerate ? 'bg-[var(--color-sage-green)]' : 'bg-[var(--color-concrete-light)]'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white border-2 border-[var(--color-deep-ink)] transition-transform ${autoGenerate ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Manual Objectives */}
          <AnimatePresence>
            {!autoGenerate && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-sm">Manual Objectives & Topics</label>
                <textarea 
                  value={manualObjectives}
                  onChange={(e) => setManualObjectives(e.target.value)}
                  className="w-full bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 font-sans focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] min-h-[100px]"
                  placeholder="Enter learning objectives and topics here..."
                  id="manual-objectives"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        <div className="p-6 border-t-2 border-[var(--color-deep-ink)] bg-[var(--color-soft-clay)] sticky bottom-0 z-20">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-[var(--color-sage-green)] text-white font-bold py-4 px-6 border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Crafting Lesson...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Lesson Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Output Area */}
      <div className={`${isInputPanelOpen ? 'hidden' : 'flex'} md:flex w-full md:w-3/4 flex-col h-screen overflow-hidden bg-[var(--color-whisper-white)] relative`}>
        {/* Top Action Bar */}
        <div className="h-16 border-b-2 border-[var(--color-deep-ink)] bg-[var(--color-crisp-page)] flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsInputPanelOpen(true)}
              className="md:hidden flex items-center justify-center p-2 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              aria-label="Open input panel"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[var(--color-deep-ink)] truncate">The Lesson Masterpiece</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={handleSave} className="flex items-center gap-2 px-2 md:px-3 py-1.5 font-bold text-sm border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
              <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-2 md:px-3 py-1.5 font-bold text-sm border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button className="flex items-center gap-2 px-2 md:px-3 py-1.5 font-bold text-sm border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
              <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 relative" style={{
          backgroundImage: 'linear-gradient(var(--color-concrete-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-concrete-light) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px',
          opacity: 0.8
        }}>
          <div className="max-w-4xl mx-auto bg-[var(--color-crisp-page)] min-h-[800px] border-2 border-[var(--color-deep-ink)] shadow-[12px_12px_0px_0px_var(--color-deep-ink)] p-10 relative z-10" ref={contentRef}>
            
            {/* Binder Rings Decoration */}
            <div className="absolute left-0 top-0 bottom-0 w-8 border-r-2 border-[var(--color-deep-ink)] flex flex-col justify-evenly items-center bg-[var(--color-soft-clay)]">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-[var(--color-whisper-white)] border-2 border-[var(--color-deep-ink)] shadow-inner"></div>
              ))}
            </div>

            <div className="pl-6">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-32 text-center"
                  >
                    <div className="relative w-32 h-32 mb-8">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-[var(--color-sage-green)] rounded-full"
                      />
                      <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-[var(--color-gold-star)]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[var(--color-deep-ink)] mb-4">Gemini Pro is crafting your {subject} plan...</h3>
                    <p className="text-[var(--color-charcoal-grey)] font-mono text-sm max-w-md">Analyzing grade level, differentiating for English proficiency, and structuring engaging activities.</p>
                  </motion.div>
                ) : generatedPlan ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose max-w-none"
                  >
                    {/* Render Image if available */}
                    {(generatedImage || isGeneratingImage) && (
                      <div className="mb-8 border-2 border-[var(--color-deep-ink)] p-2 bg-white shadow-[4px_4px_0px_0px_var(--color-deep-ink)] transform -rotate-1 hover:rotate-0 transition-transform">
                        {isGeneratingImage ? (
                          <div className="w-full aspect-video bg-[var(--color-soft-clay)] animate-pulse flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-[var(--color-concrete-light)]" />
                          </div>
                        ) : (
                          <img src={generatedImage!} alt="Lesson Plan Illustration" className="w-full h-auto object-cover border-2 border-[var(--color-deep-ink)]" />
                        )}
                        <p className="text-xs font-mono text-[var(--color-charcoal-grey)] mt-2 text-center italic">
                          {imagePrompt}
                        </p>
                      </div>
                    )}

                    <div className="markdown-body">
                      <Markdown>{generatedPlan}</Markdown>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-32 text-center opacity-50">
                    <PenLine className="w-16 h-16 text-[var(--color-deep-ink)] mb-6" />
                    <h3 className="text-2xl font-serif font-bold text-[var(--color-deep-ink)] mb-2">Ready to Plan</h3>
                    <p className="text-[var(--color-charcoal-grey)] font-sans max-w-md">Fill out the details in the Input Journal on the left and click Generate to create your masterpiece.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
