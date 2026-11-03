import React from 'react';
import { AppCard } from './AppCard';
import { DayPrayerRecord } from '../../types';
import { Calendar, ChevronLeft } from 'lucide-react';

interface DayItem {
  dateStr: string;
  dayLabel: string;
  fullDayName: string;
  isToday: boolean;
  completedCount: number; // 0 to 5
}

interface WeeklyProgressCardProps {
  days: DayItem[];
  onSelectDay: (dateStr: string) => void;
  onOpenHistory: () => void;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  days,
  onSelectDay,
  onOpenHistory,
}) => {
  const totalCompleted = days.reduce((acc, d) => acc + d.completedCount, 0);
  const totalPossible = days.length * 5;
  const weeklyPercentage = Math.round((totalCompleted / (totalPossible || 1)) * 100);

  return (
    <AppCard className="relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#172033] dark:text-white">
              إنجاز الأسبوع
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold">
              {weeklyPercentage}%
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
            كل عمود = عدد صلوات اليوم
          </p>
        </div>

        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 p-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>السجل</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7 Days Columns */}
      <div className="grid grid-cols-7 gap-2 pt-2 pb-1">
        {days.map((d) => {
          const fillPercent = Math.min((d.completedCount / 5) * 100, 100);
          const isComplete = d.completedCount === 5;

          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDay(d.dateStr)}
              className={`flex flex-col items-center group transition-all duration-150 p-1.5 rounded-2xl ${
                d.isToday
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-500/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              {/* Count fraction label */}
              <span
                className={`text-[10px] font-bold mb-1.5 ${
                  isComplete
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : d.completedCount > 0
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-[#64748B] dark:text-slate-500'
                }`}
              >
                {d.completedCount}/5
              </span>

              {/* Vertical Progress Bar */}
              <div className="w-6 h-24 bg-slate-100 dark:bg-slate-800 rounded-full relative flex flex-col justify-end p-0.5 overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
                {/* Visual graduation marks */}
                <div className="absolute inset-0 flex flex-col justify-between py-1 px-1 pointer-events-none opacity-20">
                  <div className="w-full h-px bg-slate-400" />
                  <div className="w-full h-px bg-slate-400" />
                  <div className="w-full h-px bg-slate-400" />
                  <div className="w-full h-px bg-slate-400" />
                </div>

                <div
                  style={{ height: `${fillPercent}%` }}
                  className={`w-full rounded-full transition-all duration-500 ${
                    isComplete
                      ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-xs shadow-emerald-500/30'
                      : d.completedCount > 0
                      ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-xs shadow-blue-500/20'
                      : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Day Initial / Today Label */}
              <span
                className={`text-xs mt-2 font-bold ${
                  d.isToday
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-[#172033] dark:text-slate-300'
                }`}
              >
                {d.isToday ? 'اليوم' : d.dayLabel}
              </span>
            </button>
          );
        })}
      </div>
    </AppCard>
  );
};
