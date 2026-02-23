'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

type SavedPlan = {
  id: string;
  title?: string;
  subject?: string;
  planLength?: string;
  startDate?: string | null;
  createdAt: string;
};

type CalendarEvent = {
  planId: string;
  title: string;
  subject: string;
  dayNumber: number;
  totalDays: number;
};

type Props = {
  savedPlans: SavedPlan[];
  onPlanClick: (planId: string, dayIndex: number) => void;
};

function planLengthToSchoolDays(planLength: string | undefined): number {
  if (!planLength) return 1;
  const lower = planLength.toLowerCase();
  if (lower.includes('single')) return 1;
  if (lower.includes('one week') || lower === '1 week') return 5;
  if (lower.includes('two week') || lower === '2 weeks') return 10;
  if (lower.includes('three week') || lower === '3 weeks') return 15;
  if (lower.includes('four week') || lower === '4 weeks') return 20;
  if (lower.includes('quarter')) return 45;
  if (lower.includes('semester')) return 90;
  return 1;
}

function getNextWeekday(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

function getSchoolDaysForPlan(startDateStr: string, totalDays: number): Date[] {
  const parts = startDateStr.split('-');
  let current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  
  while (current.getDay() === 0 || current.getDay() === 6) {
    current = getNextWeekday(current);
  }
  
  const days: Date[] = [new Date(current)];
  for (let i = 1; i < totalDays; i++) {
    current = getNextWeekday(current);
    days.push(new Date(current));
  }
  return days;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMonday(d: Date): Date {
  const result = new Date(d);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

const SUBJECT_COLORS: Record<string, string> = {
  'ELA': 'bg-[#6b9e7d] text-white',
  'Math': 'bg-[#c2956b] text-white',
  'Science': 'bg-[#5f8aad] text-white',
  'Social Studies': 'bg-[#a87dba] text-white',
  'Art': 'bg-[#d4887a] text-white',
  'Music': 'bg-[#8ab5a8] text-white',
  'PE': 'bg-[#c9a84c] text-white',
};

function getSubjectColor(subject: string): string {
  for (const [key, color] of Object.entries(SUBJECT_COLORS)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'bg-[var(--color-sage-green)] text-white';
}

function getTodayET(): Date {
  const nowStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const [y, m, d] = nowStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function LessonCalendar({ savedPlans, onPlanClick }: Props) {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(() => getTodayET());


  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    
    for (const plan of savedPlans) {
      if (!plan.startDate) continue;
      
      const totalDays = planLengthToSchoolDays(plan.planLength);
      const schoolDays = getSchoolDaysForPlan(plan.startDate, totalDays);
      const title = plan.title || plan.subject || 'Lesson';
      const subject = plan.subject || '';
      
      schoolDays.forEach((day, index) => {
        const key = dateKey(day);
        if (!map[key]) map[key] = [];
        map[key].push({
          planId: plan.id,
          title,
          subject,
          dayNumber: index + 1,
          totalDays,
        });
      });
    }
    return map;
  }, [savedPlans]);

  const navigateMonth = (delta: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const navigateWeek = (delta: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta * 7);
      return d;
    });
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);

    const weekdays: Date[] = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dow = date.getDay();
      if (dow >= 1 && dow <= 5) weekdays.push(date);
    }

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    for (const date of weekdays) {
      const col = date.getDay() - 1;
      if (col === 0 && currentWeek.length > 0) {
        while (currentWeek.length < 5) currentWeek.push(null);
        weeks.push(currentWeek);
        currentWeek = [];
      }
      while (currentWeek.length < col) currentWeek.push(null);
      currentWeek.push(date);
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 5) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    return weeks;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate);
    const days: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const today = dateKey(getTodayET());

  const weekLabel = useMemo(() => {
    if (weekDays.length < 5) return '';
    const mon = weekDays[0];
    const fri = weekDays[4];
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${mon.toLocaleDateString('default', opts)} – ${fri.toLocaleDateString('default', { ...opts, year: 'numeric' })}`;
  }, [weekDays]);

  const renderDayCell = (date: Date | null, isWeekView: boolean) => {
    if (!date) {
      return <div key="empty" className={`${isWeekView ? 'min-h-[120px]' : 'aspect-square'} border border-[var(--color-concrete-light)] bg-[var(--color-whisper-white)] opacity-40`} />;
    }

    const key = dateKey(date);
    const events = eventMap[key] || [];
    const isToday = key === today;

    return (
      <div
        key={key}
        className={`${isWeekView ? 'min-h-[80px] sm:min-h-[120px]' : 'aspect-square'} border-2 p-1 md:p-1.5 relative flex flex-col group transition-all h-full ${
          events.length > 0
            ? 'bg-[var(--color-soft-clay)] border-[var(--color-deep-ink)] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)]'
            : isToday
              ? 'bg-blue-50 border-blue-300'
              : 'bg-[var(--color-whisper-white)] border-[var(--color-concrete-light)]'
        }`}
      >
        <span className={`text-[10px] sm:text-xs font-mono mb-auto ${isToday ? 'font-bold text-blue-600' : 'text-[var(--color-charcoal-grey)]'}`}>
          {date.getDate()}
        </span>
        <div className="flex flex-col gap-0.5 mt-0.5 overflow-hidden w-full">
          {events.slice(0, isWeekView ? 4 : 2).map((event, i) => (
            <button
              key={`${event.planId}-${i}`}
              type="button"
              onClick={() => onPlanClick(event.planId, event.dayNumber - 1)}
              className={`${getSubjectColor(event.subject)} text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1 py-0.5 truncate border border-[var(--color-deep-ink)] text-left hover:brightness-110 transition-all cursor-pointer w-full shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]`}
              title={`${event.title} – Day ${event.dayNumber}/${event.totalDays}`}
            >
              {isWeekView ? (
                <span className="flex justify-between items-center gap-1">
                  <span className="truncate">{event.title}</span>
                  <span className="opacity-80 flex-shrink-0 font-mono text-[7px]">D{event.dayNumber}</span>
                </span>
              ) : (
                <span className="block truncate">{event.subject || event.title.slice(0, 8)}</span>
              )}
            </button>
          ))}
          {events.length > (isWeekView ? 4 : 2) && (
            <div className="text-[7px] font-bold text-center text-[var(--color-charcoal-grey)] leading-none mt-auto">
              +{events.length - (isWeekView ? 4 : 2)} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-crisp-page)] p-4 md:p-6 border-2 border-[var(--color-deep-ink)] shadow-[8px_8px_0px_0px_var(--color-deep-ink)] h-full">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-lg md:text-2xl font-serif font-bold text-[var(--color-deep-ink)] flex items-center gap-2">
          <Calendar className="w-5 h-5 md:w-6 md:h-6" /> Lesson Calendar
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('month')}
            className={`px-2 md:px-3 py-1 border-2 border-[var(--color-deep-ink)] font-bold text-xs md:text-sm ${viewMode === 'month' ? 'bg-[var(--color-sage-green)] text-white' : 'bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)]'}`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-2 md:px-3 py-1 border-2 border-[var(--color-deep-ink)] font-bold text-xs md:text-sm ${viewMode === 'week' ? 'bg-[var(--color-sage-green)] text-white' : 'bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)]'}`}
          >
            Week
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
          className="p-1 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-serif font-bold text-sm md:text-base text-[var(--color-deep-ink)]">
          {viewMode === 'month' ? monthName : weekLabel}
        </h3>
        <button
          onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
          className="p-1 border-2 border-[var(--color-deep-ink)] bg-[var(--color-whisper-white)] hover:bg-[var(--color-soft-clay)]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1 md:gap-2 auto-rows-fr">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
          <div key={day} className="text-center font-bold text-[10px] xs:text-xs md:text-sm text-[var(--color-deep-ink)] border-b-2 border-[var(--color-deep-ink)] pb-1 md:pb-2 uppercase tracking-tighter sm:tracking-normal">{day}</div>
        ))}

        {viewMode === 'month' ? (
          monthDays.flatMap((week, wi) =>
            week.map((date, di) => (
              <div key={`${wi}-${di}`} className="h-full">
                {renderDayCell(date, false)}
              </div>
            ))
          )
        ) : (
          weekDays.map((date) => (
            <div key={dateKey(date)} className="h-full">
              {renderDayCell(date, true)}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-concrete-light)] flex flex-wrap gap-x-3 gap-y-2 justify-center sm:justify-start">
        {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
          <div key={subject} className="flex items-center gap-1.5 whitespace-nowrap">
            <div className={`w-3 h-3 ${color} border border-[var(--color-deep-ink)] flex-shrink-0 shadow-[1px_1px_0px_0px_var(--color-deep-ink)]`} />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-[var(--color-charcoal-grey)]">{subject}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
