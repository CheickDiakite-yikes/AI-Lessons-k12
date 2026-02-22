'use client';

import { useState, useRef, useEffect, useMemo, isValidElement, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, Save, Printer, Share2, RefreshCw, PenLine, Image as ImageIcon, Menu, X, MoreVertical, User, Calendar, BookOpen, ArrowLeft, Camera, Plus, Trash2, Users, UserPlus, Edit2, Check } from 'lucide-react';
import Markdown, { type Components } from 'react-markdown';
import confetti from 'canvas-confetti';
import { generateLessonPlan, generateImage } from '@/lib/ai';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api-client';
import { normalizeLessonMarkdown } from '@/lib/lesson-markdown';

const PLAN_LENGTHS = ['Single Lesson', 'One Week', 'Two Weeks', 'Three Weeks', 'Four Weeks', 'One Quarter', 'One Semester'];
const GRADE_LEVELS = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade'];
const SUBJECTS = ['ELA', 'Math', 'Science', 'Social Studies'];
const ENGLISH_PROFICIENCY = ['Entering', 'Emerging', 'Developing', 'Expanding', 'Bridging'];
const ACADEMIC_LEVELS = ['Below Grade', 'At Grade', 'Above Grade'];
const ACADEMIC_LEVELS_EXTENDED = ['Significantly Below Grade', 'Below Grade', 'At Grade', 'Above Grade', 'Significantly Above Grade'];
const LEARNING_PREFERENCES = ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'Needs 1v1', 'Direction-oriented'];

type Student = {
  id: string;
  name: string;
  englishProficiency: string;
  readingLevel: string;
  mathLevel: string;
  writingLevel: string;
  academicLevel: string;
  learningPreference: string;
};

type ClassRoster = {
  id: string;
  name: string;
  students: Student[];
};

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }
  return '';
}

function getParagraphClass(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return 'lesson-p';
  }
  if (/^(name|date|student|class):/i.test(trimmed)) {
    return 'lesson-p worksheet-meta-line';
  }
  if (/^[A-F][.)]\s/.test(trimmed)) {
    return 'lesson-p worksheet-choice-line';
  }
  if (/_{6,}/.test(trimmed)) {
    return 'lesson-p worksheet-fill-line';
  }
  if (/^(terms|definitions):$/i.test(trimmed)) {
    return 'lesson-p worksheet-label';
  }
  return 'lesson-p';
}

function getListItemClass(text: string): string {
  const trimmed = text.trim();
  if (/^[A-F][.)]\s/.test(trimmed)) {
    return 'lesson-li worksheet-choice-line';
  }
  if (/^\d+[.)]\s/.test(trimmed) && /_{6,}/.test(trimmed)) {
    return 'lesson-li worksheet-fill-line';
  }
  if (/^\d+[.)]\s/.test(trimmed)) {
    return 'lesson-li worksheet-question-line';
  }
  return 'lesson-li';
}

function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: { label: string; value: string }[]; 
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={ref}>
      <div 
        className="w-full bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] p-3 md:p-3 font-sans text-lg md:text-base cursor-pointer shadow-[2px_2px_0px_0px_var(--color-deep-ink)] flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-[var(--color-deep-ink)]' : 'text-[var(--color-charcoal-grey)]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-[var(--color-deep-ink)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] max-h-60 overflow-y-auto"
          >
            {placeholder && (
              <div 
                className={`p-3 cursor-pointer hover:bg-[var(--color-sage-green)] hover:text-white transition-colors border-b-2 border-[var(--color-deep-ink)] text-[var(--color-charcoal-grey)] ${!value ? 'bg-[var(--color-soft-clay)] font-bold' : ''}`}
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
              >
                {placeholder}
              </div>
            )}
            {options.map(opt => (
              <div 
                key={opt.value}
                className={`p-3 cursor-pointer hover:bg-[var(--color-sage-green)] hover:text-white transition-colors border-b-2 border-[var(--color-deep-ink)] last:border-b-0 ${value === opt.value ? 'bg-[var(--color-soft-clay)] font-bold' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LessonPlanner() {
  const { user, signOut: handleSignOut } = useAuth();
  const [planLength, setPlanLength] = useState(PLAN_LENGTHS[0]);
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[2]);
  const [subject, setSubject] = useState(SUBJECTS[1]);
  const [duration, setDuration] = useState('45');
  const [englishProficiency, setEnglishProficiency] = useState<string[]>([]);
  const [academicLevels, setAcademicLevels] = useState<string[]>([]);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [manualObjectives, setManualObjectives] = useState('');
  const [includeWorksheets, setIncludeWorksheets] = useState(false);
  const [includeSlides, setIncludeSlides] = useState(false);
  const [isInputPanelOpen, setIsInputPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'planner' | 'profile'>('planner');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Class Management State
  const [classes, setClasses] = useState<ClassRoster[]>([]);

  useEffect(() => {
    const loadRosters = async () => {
      try {
        const rosters = await api.classRosters.list();
        setClasses(rosters.map((r: any) => ({
          id: r.id,
          name: r.name,
          students: (r.students || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            englishProficiency: s.englishProficiency,
            readingLevel: s.readingLevel,
            mathLevel: s.mathLevel,
            writingLevel: s.writingLevel,
            academicLevel: s.academicLevel,
            learningPreference: s.learningPreference,
          })),
        })));
      } catch (error) {
        console.error('Failed to load rosters:', error);
      }
    };
    loadRosters();
  }, []);
  const [newClassName, setNewClassName] = useState('');
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingClassName, setEditingClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedClassIdForRoster, setSelectedClassIdForRoster] = useState<string | null>(null);
  const [isClassListExpanded, setIsClassListExpanded] = useState(false);
  
  // Student Management State
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    englishProficiency: ENGLISH_PROFICIENCY[3],
    readingLevel: 'At Grade',
    mathLevel: 'At Grade',
    writingLevel: 'At Grade',
    academicLevel: 'At Grade',
    learningPreference: 'Visual'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);
  const rosterRef = useRef<HTMLDivElement>(null);
  const renderedPlan = useMemo(() => normalizeLessonMarkdown(generatedPlan ?? ''), [generatedPlan]);

  const markdownComponents = useMemo<Components>(() => ({
    h1: ({ children }) => <h1 className="lesson-h1">{children}</h1>,
    h2: ({ children }) => {
      const text = getNodeText(children).toLowerCase();
      const className = text.includes('optional generated add-ons') ? 'lesson-h2 lesson-h2-addons' : 'lesson-h2';
      return <h2 className={className}>{children}</h2>;
    },
    h3: ({ children }) => {
      const text = getNodeText(children).toLowerCase();
      if (text.includes('worksheet')) {
        return <h3 className="lesson-h3 worksheet-title">{children}</h3>;
      }
      if (text.includes('answer key')) {
        return <h3 className="lesson-h3 worksheet-answer-title">{children}</h3>;
      }
      return <h3 className="lesson-h3">{children}</h3>;
    },
    h4: ({ children }) => {
      const text = getNodeText(children).toLowerCase();
      if (text.includes('student copy')) {
        return <h4 className="lesson-h4 worksheet-subtitle">{children}</h4>;
      }
      if (text.includes('answer key')) {
        return <h4 className="lesson-h4 worksheet-answer-subtitle">{children}</h4>;
      }
      if (text.includes('differentiation note')) {
        return <h4 className="lesson-h4 worksheet-note-subtitle">{children}</h4>;
      }
      return <h4 className="lesson-h4">{children}</h4>;
    },
    p: ({ children }) => <p className={getParagraphClass(getNodeText(children))}>{children}</p>,
    ul: ({ children }) => <ul className="lesson-ul">{children}</ul>,
    ol: ({ children }) => <ol className="lesson-ol">{children}</ol>,
    li: ({ children }) => <li className={getListItemClass(getNodeText(children))}>{children}</li>,
    strong: ({ children }) => <strong className="lesson-strong">{children}</strong>,
    blockquote: ({ children }) => <blockquote className="lesson-callout">{children}</blockquote>,
    img: ({ src, alt }) => <img src={src || ''} alt={alt || 'Lesson visual'} className="lesson-inline-image" />,
    hr: () => <div className="lesson-divider" aria-hidden="true" />,
  }), []);

  useEffect(() => {
    const loadSavedPlans = async () => {
      try {
        const plans = await api.lessonPlans.list();
        setSavedPlans(plans);
      } catch (error) {
        console.error('Failed to load saved plans:', error);
      }
    };
    loadSavedPlans();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsInputPanelOpen(false);
    setGeneratedPlan(null);
    setGeneratedImage(null);
    setImagePrompt(null);
    
    try {
      let studentsContext = undefined;
      if (selectedClassId) {
        const selectedClass = classes.find(c => c.id === selectedClassId);
        if (selectedClass && selectedClass.students.length > 0) {
          studentsContext = selectedClass.students.map(s => 
            `- ${s.name}: English: ${s.englishProficiency}, Reading: ${s.readingLevel}, Math: ${s.mathLevel}, Writing: ${s.writingLevel}, Academic: ${s.academicLevel}, Preference: ${s.learningPreference}`
          ).join('\n');
        }
      }

      const plan = await generateLessonPlan({
        planLength,
        gradeLevel,
        subject,
        duration,
        englishProficiency,
        academicLevels,
        autoGenerate,
        manualObjectives,
        includeWorksheets,
        includeSlides,
        studentsContext
      });
      
      setGeneratedPlan(plan.text);
      
      let image: string | null = null;
      if (plan.imagePrompt) {
        setImagePrompt(plan.imagePrompt);
        setIsGeneratingImage(true);
        image = await generateImage(plan.imagePrompt);
        setGeneratedImage(image);
        setIsGeneratingImage(false);
      }

      try {
        const saved: any = await api.lessonPlans.create({
          content: plan.text,
          imagePrompt: plan.imagePrompt || undefined,
          imageBase64: image || undefined,
          planLength,
          gradeLevel,
          subject,
          duration,
          classRosterId: selectedClassId || undefined,
          parameters: { englishProficiency, academicLevels, autoGenerate, manualObjectives, includeWorksheets, includeSlides },
        });
        setCurrentPlanId(saved.id);
        setSavedPlans(prev => [saved, ...prev]);
      } catch (saveError) {
        console.error('Failed to save lesson plan:', saveError);
      }
      
    } catch (error) {
      console.error("Failed to generate:", error);
      const message = error instanceof Error ? error.message : 'Failed to generate lesson plan. Please try again.';
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    
    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    const exportNode = contentRef.current;
    
    const opt = {
      margin:       10,
      filename:     `Lesson_Plan_${subject}_${gradeLevel}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    exportNode.classList.add('pdf-export-mode');
    document.body.classList.add('pdf-exporting');

    try {
      await html2pdf().set(opt).from(exportNode).save();
      triggerConfetti();
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      exportNode.classList.remove('pdf-export-mode');
      document.body.classList.remove('pdf-exporting');
    }
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

  const handleSave = async () => {
    if (!generatedPlan || !currentPlanId) return;
    try {
      await api.lessonPlans.update(currentPlanId, {
        content: generatedPlan,
        planLength,
        gradeLevel,
        subject,
        duration,
        classRosterId: selectedClassId || null,
        parameters: { englishProficiency, academicLevels, autoGenerate, manualObjectives, includeWorksheets, includeSlides },
      });
      triggerConfetti();
    } catch (error) {
      console.error('Failed to save lesson plan:', error);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMultiSelect = (item: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (state.includes(item)) {
      setState(state.filter(i => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClass = async () => {
    if (newClassName.trim() && !classes.find(c => c.name === newClassName.trim())) {
      try {
        const created: any = await api.classRosters.create(newClassName.trim());
        setClasses([...classes, { id: created.id, name: created.name, students: [] }]);
        setNewClassName('');
      } catch (error) {
        console.error('Failed to create class:', error);
      }
    }
  };

  const handleStartEditClass = (cls: ClassRoster) => {
    setEditingClassId(cls.id);
    setEditingClassName(cls.name);
  };

  const handleSaveEditClass = async () => {
    if (editingClassName.trim() && editingClassId) {
      try {
        await api.classRosters.update(editingClassId, editingClassName.trim());
        setClasses(classes.map(c => 
          c.id === editingClassId ? { ...c, name: editingClassName.trim() } : c
        ));
      } catch (error) {
        console.error('Failed to rename class:', error);
      }
    }
    setEditingClassId(null);
    setEditingClassName('');
  };

  const handleDeleteClass = async (classIdToDelete: string) => {
    try {
      await api.classRosters.delete(classIdToDelete);
      setClasses(classes.filter(c => c.id !== classIdToDelete));
      if (selectedClassId === classIdToDelete) {
        setSelectedClassId('');
      }
      if (selectedClassIdForRoster === classIdToDelete) {
        setSelectedClassIdForRoster(null);
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name?.trim() || !selectedClassIdForRoster) return;
    
    const studentData = {
      name: newStudent.name.trim(),
      englishProficiency: newStudent.englishProficiency || ENGLISH_PROFICIENCY[3],
      readingLevel: newStudent.readingLevel || 'At Grade',
      mathLevel: newStudent.mathLevel || 'At Grade',
      writingLevel: newStudent.writingLevel || 'At Grade',
      academicLevel: newStudent.academicLevel || 'At Grade',
      learningPreference: newStudent.learningPreference || 'Visual'
    };

    try {
      const created: any = await api.students.create(selectedClassIdForRoster, studentData);
      const student: Student = {
        id: created.id,
        name: created.name,
        englishProficiency: created.englishProficiency,
        readingLevel: created.readingLevel,
        mathLevel: created.mathLevel,
        writingLevel: created.writingLevel,
        academicLevel: created.academicLevel,
        learningPreference: created.learningPreference,
      };

      setClasses(classes.map(c => {
        if (c.id === selectedClassIdForRoster) {
          return { ...c, students: [...c.students, student] };
        }
        return c;
      }));
      
      setNewStudent({
        englishProficiency: ENGLISH_PROFICIENCY[3],
        readingLevel: 'At Grade',
        mathLevel: 'At Grade',
        writingLevel: 'At Grade',
        academicLevel: 'At Grade',
        learningPreference: 'Visual'
      });
      setIsAddingStudent(false);
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const handleDeleteStudent = async (classId: string, studentId: string) => {
    try {
      await api.students.delete(classId, studentId);
      setClasses(classes.map(c => {
        if (c.id === classId) {
          return { ...c, students: c.students.filter(s => s.id !== studentId) };
        }
        return c;
      }));
    } catch (error) {
      console.error('Failed to delete student:', error);
    }
  };

  const handleSelectClassForRoster = (classId: string) => {
    if (editingClassId !== classId) {
      setSelectedClassIdForRoster(classId);
      setTimeout(() => {
        rosterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-[var(--color-whisper-white)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b-2 border-[var(--color-deep-ink)] gap-4">
            <button 
              onClick={() => setCurrentView('planner')}
              className="flex items-center gap-2 px-4 py-2 font-bold text-[var(--color-deep-ink)] hover:bg-[var(--color-soft-clay)] transition-colors rounded-lg self-start md:self-auto"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Planner
            </button>
            <div className="flex items-center gap-4 self-start md:self-auto">
              <div className="relative group">
                <div 
                  className="w-16 h-16 rounded-full border-2 border-[var(--color-deep-ink)] bg-[var(--color-blush-pink)] overflow-hidden flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_var(--color-deep-ink)]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : user?.image ? (
                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[var(--color-deep-ink)]" />
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleProfilePicChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-serif font-bold text-[var(--color-deep-ink)]">
                  {user?.name || 'Teacher Profile'}
                </h1>
                <button 
                  onClick={handleSignOut}
                  className="text-sm text-red-600 font-bold hover:underline self-start mt-1"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Classes */}
            <div className="lg:col-start-1 lg:row-start-1 order-1">
              <div className="bg-[var(--color-crisp-page)] p-6 border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] h-full flex flex-col">
                <div 
                  className="flex items-center justify-between mb-4 cursor-pointer group"
                  onClick={() => setIsClassListExpanded(!isClassListExpanded)}
                >
                  <h2 className="text-xl font-serif font-bold text-[var(--color-deep-ink)] flex items-center gap-2 group-hover:text-[var(--color-sage-green)] transition-colors">
                    <BookOpen className="w-5 h-5" /> My Classes
                  </h2>
                  <button className="p-1 text-[var(--color-deep-ink)] group-hover:text-[var(--color-sage-green)] transition-colors">
                    {isClassListExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {isClassListExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col flex-1"
                    >
                      {/* Add New Class */}
                      <div className="flex gap-2 mb-4">
                        <input 
                          type="text" 
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
                          placeholder="New class name..."
                          className="flex-1 bg-[var(--color-whisper-white)] border-2 border-[var(--color-deep-ink)] p-2 text-sm font-sans focus:outline-none focus:border-[var(--color-sage-green)]"
                        />
                        <button 
                          onClick={handleAddClass}
                          disabled={!newClassName.trim()}
                          className="p-2 bg-[var(--color-sage-green)] text-white border-2 border-[var(--color-deep-ink)] hover:bg-[#5a8a6f] disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 flex-1">
                        {classes.length === 0 ? (
                          <p className="text-sm text-[var(--color-charcoal-grey)] italic">No classes added yet.</p>
                        ) : (
                          classes.map((cls) => (
                            <div 
                              key={cls.id} 
                              className={`p-3 border-2 border-[var(--color-deep-ink)] flex justify-between items-center group cursor-pointer transition-colors ${selectedClassIdForRoster === cls.id ? 'bg-[var(--color-sage-green)] text-white' : 'bg-[var(--color-soft-clay)] hover:bg-[var(--color-sage-green)] hover:text-white'}`}
                              onClick={() => handleSelectClassForRoster(cls.id)}
                            >
                              {editingClassId === cls.id ? (
                                <div className="flex-1 flex items-center gap-2 mr-2" onClick={e => e.stopPropagation()}>
                                  <input 
                                    type="text" 
                                    value={editingClassName}
                                    onChange={(e) => setEditingClassName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEditClass()}
                                    className="flex-1 bg-[var(--color-whisper-white)] border-2 border-[var(--color-deep-ink)] p-1 text-sm font-sans text-black focus:outline-none focus:border-[var(--color-sage-green)]"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={handleSaveEditClass}
                                    className="text-[var(--color-deep-ink)] hover:text-[var(--color-sage-green)] p-1"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex flex-col overflow-hidden mr-2">
                                    <span className="font-bold text-sm truncate">{cls.name}</span>
                                    <span className="text-xs opacity-80">{cls.students.length} Students</span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleStartEditClass(cls); }}
                                      className={`p-1 ${selectedClassIdForRoster === cls.id ? 'text-white hover:text-[var(--color-deep-ink)]' : 'text-[var(--color-charcoal-grey)] hover:text-white'}`}
                                      aria-label="Edit class"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }}
                                      className={`p-1 ${selectedClassIdForRoster === cls.id ? 'text-white hover:text-red-300' : 'text-[var(--color-charcoal-grey)] hover:text-red-300'}`}
                                      aria-label="Delete class"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Calendar View or Roster View */}
            <div className="lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-2 order-2" ref={rosterRef}>
              {selectedClassIdForRoster ? (
                <div className="bg-[var(--color-crisp-page)] p-6 border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] h-full flex flex-col">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-serif font-bold text-[var(--color-deep-ink)] flex items-center gap-2">
                        <Users className="w-6 h-6" /> {classes.find(c => c.id === selectedClassIdForRoster)?.name} Roster
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedClassIdForRoster(null)} className="px-3 py-1.5 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] font-bold text-sm hover:bg-[var(--color-soft-clay)]">
                        Close Roster
                      </button>
                      <button onClick={() => setIsAddingStudent(!isAddingStudent)} className="flex items-center gap-2 px-3 py-1.5 border-2 border-[var(--color-deep-ink)] bg-[var(--color-sage-green)] text-white font-bold text-sm hover:bg-[#5a8a6f]">
                        <UserPlus className="w-4 h-4" /> Add Student
                      </button>
                    </div>
                  </div>

                  {/* Add Student Form */}
                  <AnimatePresence>
                    {isAddingStudent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 border-2 border-[var(--color-deep-ink)] bg-[var(--color-soft-clay)] p-4 overflow-hidden"
                      >
                        <h3 className="font-bold text-[var(--color-deep-ink)] mb-4">New Student Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
                            <input 
                              type="text" 
                              value={newStudent.name || ''}
                              onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                              placeholder="Student Name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">English Proficiency</label>
                            <select 
                              value={newStudent.englishProficiency}
                              onChange={(e) => setNewStudent({...newStudent, englishProficiency: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                            >
                              {ENGLISH_PROFICIENCY.map(ep => <option key={ep} value={ep}>{ep}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Reading Level</label>
                            <select 
                              value={newStudent.readingLevel}
                              onChange={(e) => setNewStudent({...newStudent, readingLevel: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                            >
                              {ACADEMIC_LEVELS_EXTENDED.map(al => <option key={al} value={al}>{al}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Math Level</label>
                            <select 
                              value={newStudent.mathLevel}
                              onChange={(e) => setNewStudent({...newStudent, mathLevel: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                            >
                              {ACADEMIC_LEVELS_EXTENDED.map(al => <option key={al} value={al}>{al}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Writing Level</label>
                            <select 
                              value={newStudent.writingLevel}
                              onChange={(e) => setNewStudent({...newStudent, writingLevel: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                            >
                              {ACADEMIC_LEVELS_EXTENDED.map(al => <option key={al} value={al}>{al}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Overall Academic</label>
                            <select 
                              value={newStudent.academicLevel}
                              onChange={(e) => setNewStudent({...newStudent, academicLevel: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                            >
                              {ACADEMIC_LEVELS_EXTENDED.map(al => <option key={al} value={al}>{al}</option>)}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1">Learning Preference</label>
                            <select 
                              value={newStudent.learningPreference}
                              onChange={(e) => setNewStudent({...newStudent, learningPreference: e.target.value})}
                              className="w-full border-2 border-[var(--color-deep-ink)] p-2 text-sm focus:outline-none focus:border-[var(--color-sage-green)]"
                            >
                              {LEARNING_PREFERENCES.map(lp => <option key={lp} value={lp}>{lp}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={handleAddStudent}
                            disabled={!newStudent.name?.trim()}
                            className="px-4 py-2 bg-[var(--color-deep-ink)] text-white font-bold text-sm hover:bg-black disabled:opacity-50 transition-colors"
                          >
                            Save Student
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Student List */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {classes.find(c => c.id === selectedClassIdForRoster)?.students.length === 0 ? (
                      <div className="text-center py-12 text-[var(--color-charcoal-grey)] opacity-70">
                        <Users className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-sans">No students in this roster yet.</p>
                        <p className="text-sm">Click &quot;Add Student&quot; to start building your class.</p>
                      </div>
                    ) : (
                      classes.find(c => c.id === selectedClassIdForRoster)?.students.map(student => (
                        <div key={student.id} className="p-4 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] relative group">
                          <button 
                            onClick={() => handleDeleteStudent(selectedClassIdForRoster, student.id)}
                            className="absolute top-4 right-4 text-[var(--color-charcoal-grey)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <h4 className="font-bold text-lg text-[var(--color-deep-ink)] mb-2">{student.name}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono text-[var(--color-charcoal-grey)]">
                            <div><span className="font-bold text-[var(--color-deep-ink)]">English:</span> {student.englishProficiency}</div>
                            <div><span className="font-bold text-[var(--color-deep-ink)]">Reading:</span> {student.readingLevel}</div>
                            <div><span className="font-bold text-[var(--color-deep-ink)]">Math:</span> {student.mathLevel}</div>
                            <div><span className="font-bold text-[var(--color-deep-ink)]">Writing:</span> {student.writingLevel}</div>
                            <div><span className="font-bold text-[var(--color-deep-ink)]">Academic:</span> {student.academicLevel}</div>
                            <div><span className="font-bold text-[var(--color-deep-ink)]">Pref:</span> {student.learningPreference}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[var(--color-crisp-page)] p-6 border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold text-[var(--color-deep-ink)] flex items-center gap-2">
                      <Calendar className="w-6 h-6" /> Lesson Calendar
                    </h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border-2 border-[var(--color-deep-ink)] bg-[var(--color-sage-green)] text-white font-bold text-sm">Month</button>
                      <button className="px-3 py-1 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] font-bold text-sm hover:bg-[var(--color-soft-clay)]">Week</button>
                    </div>
                  </div>

                  {/* Mock Calendar Grid */}
                  <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                      <div key={day} className="text-center font-bold text-[var(--color-deep-ink)] border-b-2 border-[var(--color-deep-ink)] pb-2">{day}</div>
                    ))}
                    
                    {/* Calendar Days */}
                    {[...Array(20)].map((_, i) => {
                      const hasLesson = i === 2 || i === 7 || i === 14;
                      return (
                        <div key={i} className={`aspect-square border-2 border-[var(--color-concrete-light)] p-1 md:p-2 relative ${hasLesson ? 'bg-[var(--color-soft-clay)] border-[var(--color-deep-ink)]' : 'bg-[var(--color-whisper-white)]'}`}>
                          <span className="text-xs font-mono text-[var(--color-charcoal-grey)]">{i + 1}</span>
                          {hasLesson && (
                            <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 right-1 md:right-2 bg-[var(--color-sage-green)] text-white text-[10px] md:text-xs font-bold p-1 truncate border border-[var(--color-deep-ink)]">
                              Science Unit
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Saved Plans */}
            <div className="lg:col-start-1 lg:row-start-2 order-3">
              <div className="bg-[var(--color-crisp-page)] p-6 border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] h-full">
                <h2 className="text-xl font-serif font-bold text-[var(--color-deep-ink)] mb-4 flex items-center gap-2">
                  <Save className="w-5 h-5" /> Saved Plans
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {savedPlans.length === 0 ? (
                    <p className="text-sm text-[var(--color-charcoal-grey)] italic">No saved plans yet. Generate your first lesson!</p>
                  ) : (
                    savedPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-3 border-2 bg-[var(--color-whisper-white)] flex justify-between items-center cursor-pointer hover:border-[var(--color-sage-green)] transition-colors group ${currentPlanId === plan.id ? 'border-[var(--color-sage-green)] bg-[var(--color-soft-clay)]' : 'border-[var(--color-deep-ink)]'}`}
                        onClick={() => {
                          setGeneratedPlan(plan.content);
                          setCurrentPlanId(plan.id);
                          setImagePrompt(plan.imagePrompt || null);
                          if (plan.imageKey) {
                            api.fetchImageAsDataUrl(plan.imageKey).then(setGeneratedImage).catch(() => setGeneratedImage(null));
                          } else {
                            setGeneratedImage(null);
                          }
                          if (plan.planLength) setPlanLength(plan.planLength);
                          if (plan.gradeLevel) setGradeLevel(plan.gradeLevel);
                          if (plan.subject) setSubject(plan.subject);
                          if (plan.duration) setDuration(plan.duration);
                          setCurrentView('planner');
                          setIsInputPanelOpen(false);
                        }}
                      >
                        <div className="flex flex-col overflow-hidden mr-2">
                          <span className="font-bold text-sm truncate">{plan.title || 'Untitled Plan'}</span>
                          <span className="text-xs text-[var(--color-charcoal-grey)]">
                            {plan.subject && plan.gradeLevel ? `${plan.subject} · ${plan.gradeLevel}` : ''}
                            {plan.planLength ? ` · ${plan.planLength}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[var(--color-charcoal-grey)] whitespace-nowrap">
                            {new Date(plan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this lesson plan?')) {
                                api.lessonPlans.delete(plan.id).then(() => {
                                  setSavedPlans(prev => prev.filter(p => p.id !== plan.id));
                                  if (currentPlanId === plan.id) {
                                    setCurrentPlanId(null);
                                    setGeneratedPlan(null);
                                    setGeneratedImage(null);
                                  }
                                }).catch(err => console.error('Failed to delete:', err));
                              }
                            }}
                            className="p-1 text-[var(--color-charcoal-grey)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--color-whisper-white)]">
      {/* Left Panel - Input Journal */}
      {isInputPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsInputPanelOpen(false)}
        />
      )}
      <div className={`${isInputPanelOpen ? 'flex' : 'hidden'} lg:flex fixed lg:relative inset-y-0 left-0 w-[85%] sm:w-[70%] md:w-[50%] lg:w-1/4 bg-[var(--color-soft-clay)] border-r-4 border-[var(--color-deep-ink)] flex-col h-screen lg:sticky top-0 overflow-y-auto shadow-[4px_0px_0px_var(--color-deep-ink)] z-40 lg:z-20 app-input-panel no-print`}>
        <div className="p-6 border-b-2 border-[var(--color-deep-ink)] bg-[var(--color-soft-clay)] sticky top-0 z-20 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-[var(--color-deep-ink)] flex items-center gap-2">
            <PenLine className="w-6 h-6" />
            The Input Journal
          </h1>
          <button 
            onClick={() => setIsInputPanelOpen(false)}
            className="lg:hidden flex items-center justify-center p-2 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
            aria-label="Close input panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-8 flex-1">
          {/* Target Class/Roster (Optional) */}
          {classes.length > 0 && (
            <div className="space-y-2">
              <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Target Class (Optional)</label>
              <CustomSelect 
                value={selectedClassId}
                onChange={setSelectedClassId}
                options={classes.map(cls => ({ label: cls.name, value: cls.id }))}
                placeholder="-- Select a Class --"
              />
            </div>
          )}

          {/* Plan Length */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Plan Length</label>
            <CustomSelect 
              value={planLength}
              onChange={setPlanLength}
              options={PLAN_LENGTHS.map(pl => ({ label: pl, value: pl }))}
            />
          </div>

          {/* Grade Level */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Grade Level</label>
            <CustomSelect 
              value={gradeLevel}
              onChange={setGradeLevel}
              options={GRADE_LEVELS.map(gl => ({ label: gl, value: gl }))}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Subject</label>
            <CustomSelect 
              value={subject}
              onChange={setSubject}
              options={SUBJECTS.map(s => ({ label: s, value: s }))}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Lesson Duration (mins)</label>
            <input 
              type="number" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 md:p-3 font-sans text-lg md:text-base focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]"
            />
          </div>

          {/* English Proficiency */}
          {!selectedClassId && (
            <div className="space-y-2">
              <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">English Proficiency (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {ENGLISH_PROFICIENCY.map(ep => (
                  <button
                    key={ep}
                    onClick={() => toggleMultiSelect(ep, englishProficiency, setEnglishProficiency)}
                    className={`px-4 py-2 md:px-3 md:py-1.5 border-2 border-[var(--color-deep-ink)] text-base md:text-sm font-bold transition-all ${
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
          )}

          {/* Academic Levels */}
          {!selectedClassId && (
            <div className="space-y-2">
              <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Academic Levels (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {ACADEMIC_LEVELS.map(al => (
                  <button
                    key={al}
                    onClick={() => toggleMultiSelect(al, academicLevels, setAcademicLevels)}
                    className={`px-4 py-2 md:px-3 md:py-1.5 border-2 border-[var(--color-deep-ink)] text-base md:text-sm font-bold transition-all ${
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
          )}

          {/* Auto Generate Toggle */}
          <div className="flex items-center justify-between p-4 border-2 border-[var(--color-deep-ink)] bg-[var(--color-crisp-page)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 md:w-5 md:h-5 text-[var(--color-gold-star)]" />
              <span className="font-bold text-[var(--color-deep-ink)] text-base md:text-sm">Auto-Generate Objectives</span>
            </div>
            <button 
              onClick={() => setAutoGenerate(!autoGenerate)}
              className={`w-14 h-7 md:w-12 md:h-6 rounded-full border-2 border-[var(--color-deep-ink)] relative transition-colors ${autoGenerate ? 'bg-[var(--color-sage-green)]' : 'bg-[var(--color-concrete-light)]'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 md:w-4 md:h-4 rounded-full bg-white border-2 border-[var(--color-deep-ink)] transition-transform ${autoGenerate ? 'translate-x-7 md:translate-x-6' : 'translate-x-0'}`} />
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
                <label className="block font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Manual Objectives & Topics</label>
                <textarea 
                  value={manualObjectives}
                  onChange={(e) => setManualObjectives(e.target.value)}
                  className="w-full bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] rounded-none p-3 font-sans text-lg md:text-base focus:outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] min-h-[100px]"
                  placeholder="Enter learning objectives and topics here..."
                  id="manual-objectives"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optional Add-ons */}
          <div className="space-y-3 p-4 border-2 border-[var(--color-deep-ink)] bg-[var(--color-crisp-page)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)]">
            <div>
              <h3 className="font-bold text-[var(--color-deep-ink)] uppercase tracking-wider text-base md:text-sm">Optional Add-ons</h3>
              <p className="text-xs text-[var(--color-charcoal-grey)] mt-1">Generate extra teacher-ready assets with your lesson.</p>
            </div>

            <label className="flex items-center justify-between gap-3">
              <span className="font-bold text-sm text-[var(--color-deep-ink)]">Include Worksheets</span>
              <button
                type="button"
                onClick={() => setIncludeWorksheets(!includeWorksheets)}
                className={`w-14 h-7 md:w-12 md:h-6 rounded-full border-2 border-[var(--color-deep-ink)] relative transition-colors ${includeWorksheets ? 'bg-[var(--color-sage-green)]' : 'bg-[var(--color-concrete-light)]'}`}
                aria-label="Toggle worksheets add-on"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 md:w-4 md:h-4 rounded-full bg-white border-2 border-[var(--color-deep-ink)] transition-transform ${includeWorksheets ? 'translate-x-7 md:translate-x-6' : 'translate-x-0'}`} />
              </button>
            </label>

            <label className="flex items-center justify-between gap-3">
              <span className="font-bold text-sm text-[var(--color-deep-ink)]">Include Slide Outline</span>
              <button
                type="button"
                onClick={() => setIncludeSlides(!includeSlides)}
                className={`w-14 h-7 md:w-12 md:h-6 rounded-full border-2 border-[var(--color-deep-ink)] relative transition-colors ${includeSlides ? 'bg-[var(--color-sage-green)]' : 'bg-[var(--color-concrete-light)]'}`}
                aria-label="Toggle slides add-on"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 md:w-4 md:h-4 rounded-full bg-white border-2 border-[var(--color-deep-ink)] transition-transform ${includeSlides ? 'translate-x-7 md:translate-x-6' : 'translate-x-0'}`} />
              </button>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="p-6 border-t-2 border-[var(--color-deep-ink)] bg-[var(--color-soft-clay)] sticky bottom-0 z-20">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-[var(--color-sage-green)] text-white font-bold py-4 px-6 text-lg border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-deep-ink)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                Crafting Lesson...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Lesson Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Output Area */}
      <div className="flex w-full lg:w-3/4 flex-col h-screen overflow-hidden bg-[var(--color-whisper-white)] relative app-output-panel">
        {/* Top Action Bar */}
        <div className="h-16 border-b-2 border-[var(--color-deep-ink)] bg-[var(--color-crisp-page)] flex items-center justify-between px-4 md:px-6 shrink-0 z-10 app-top-action-bar no-print">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsInputPanelOpen(true)}
              className="lg:hidden flex items-center justify-center p-2 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              aria-label="Open input panel"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-serif font-bold text-lg md:text-xl text-[var(--color-deep-ink)] truncate">The Lesson Masterpiece</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4 relative">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              <button onClick={handleSave} className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 font-bold text-sm border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                <Save className="w-4 h-4" /> <span>Save</span>
              </button>
              <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 font-bold text-sm border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                <Printer className="w-4 h-4" /> <span className="hidden lg:inline">Export</span> <span>PDF</span>
              </button>
              <button className="flex items-center gap-1.5 px-2 lg:px-3 py-1.5 font-bold text-sm border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                <Share2 className="w-4 h-4" /> <span>Share</span>
              </button>
            </div>

            {/* Profile Button (Desktop & Mobile) */}
            <button 
              onClick={() => setCurrentView('profile')}
              className="flex items-center justify-center w-10 h-10 border-2 border-[var(--color-deep-ink)] bg-[var(--color-blush-pink)] hover:bg-[#ffb0bd] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none rounded-full overflow-hidden p-0"
              aria-label="Profile"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[var(--color-deep-ink)]" />
              )}
            </button>

            {/* Mobile Dropdown Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)] shadow-[2px_2px_0px_0px_var(--color-deep-ink)] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              aria-label="More actions menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Mobile Dropdown Content */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-[var(--color-crisp-page)] border-2 border-[var(--color-deep-ink)] shadow-[4px_4px_0px_0px_var(--color-deep-ink)] flex flex-col z-50 md:hidden"
                >
                  <button onClick={handleSave} className="flex items-center gap-3 px-4 py-3 font-bold text-sm border-b-2 border-[var(--color-deep-ink)] hover:bg-[var(--color-soft-clay)] text-left">
                    <Save className="w-4 h-4" /> Save Plan
                  </button>
                  <button onClick={() => { handleExportPDF(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 font-bold text-sm border-b-2 border-[var(--color-deep-ink)] hover:bg-[var(--color-soft-clay)] text-left">
                    <Printer className="w-4 h-4" /> Export PDF
                  </button>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 font-bold text-sm hover:bg-[var(--color-soft-clay)] text-left">
                    <Share2 className="w-4 h-4" /> Share Link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative lesson-canvas" style={{
          backgroundImage: 'linear-gradient(var(--color-concrete-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-concrete-light) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px',
          opacity: 0.8
        }}>
          <div className="max-w-4xl mx-auto bg-[var(--color-crisp-page)] min-h-[800px] border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] md:shadow-[12px_12px_0px_0px_var(--color-deep-ink)] p-6 md:p-10 relative z-10 lesson-paper" ref={contentRef}>
            
            {/* Binder Rings Decoration */}
            <div className="absolute left-0 top-0 bottom-0 w-6 md:w-8 border-r-2 border-[var(--color-deep-ink)] flex flex-col justify-evenly items-center bg-[var(--color-soft-clay)] lesson-binder-rings">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[var(--color-whisper-white)] border-2 border-[var(--color-deep-ink)] shadow-inner"></div>
              ))}
            </div>

            <div className="pl-8 md:pl-10 lesson-paper-body">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-20 md:py-32 text-center"
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 mb-8">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-dashed border-[var(--color-sage-green)] rounded-full"
                      />
                      <Sparkles className="absolute inset-0 m-auto w-10 h-10 md:w-12 md:h-12 text-[var(--color-gold-star)]" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-deep-ink)] mb-4">Gemini Pro is crafting your {subject} plan...</h3>
                    <p className="text-[var(--color-charcoal-grey)] font-mono text-sm md:text-base max-w-md">Aligning objectives, Massachusetts standards, differentiation, and selected add-ons.</p>
                  </motion.div>
                ) : generatedPlan ? (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-none"
                  >
                    {/* Render Image if available */}
                    {(generatedImage || isGeneratingImage) && (
                      <div className="mb-8 border-2 border-[var(--color-deep-ink)] p-2 bg-white shadow-[4px_4px_0px_0px_var(--color-deep-ink)] transform -rotate-1 hover:rotate-0 transition-transform lesson-hero-frame">
                        {isGeneratingImage ? (
                          <div className="w-full aspect-video bg-[var(--color-soft-clay)] animate-pulse flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-[var(--color-concrete-light)]" />
                          </div>
                        ) : (
                          <img src={generatedImage!} alt="Lesson Plan Illustration" className="w-full h-auto object-cover border-2 border-[var(--color-deep-ink)]" />
                        )}
                        <p className="text-xs md:text-sm font-mono text-[var(--color-charcoal-grey)] mt-2 text-center italic">
                          {imagePrompt}
                        </p>
                      </div>
                    )}

                    <div className="lesson-markdown">
                      <Markdown components={markdownComponents}>{renderedPlan}</Markdown>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 md:py-32 text-center opacity-50">
                    <PenLine className="w-12 h-12 md:w-16 md:h-16 text-[var(--color-deep-ink)] mb-6" />
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[var(--color-deep-ink)] mb-2">Ready to Plan</h3>
                    <p className="text-[var(--color-charcoal-grey)] font-sans text-base md:text-lg max-w-md">Fill out the details in the Input Journal on the left and click Generate to create your masterpiece.</p>
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
