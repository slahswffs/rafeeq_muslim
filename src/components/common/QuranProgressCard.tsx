import React from 'react';
import { AppCard } from './AppCard';
import { QuranReadingPosition } from '../../types';
import { BookOpen, ArrowLeft, Bookmark } from 'lucide-react';

interface QuranProgressCardProps {
  lastRead: QuranReadingPosition;
  onStartReading: () => void;
  onOpenMushaf: () => void;
}

export const QuranProgressCard: React.FC<QuranProgressCardProps> = ({
  lastRead,
  onStartReading,
  onOpenMushaf,
}) => {
  // Approximate progress across 30 Juz
  const juzProgressPercent = Math.min(Math.round(((lastRead.juz - 1) / 30) * 100) + 3, 100);

  return (
    <AppCard className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/40 dark:from-[#172033] dark:to-blue-950/20">
      {/* Decorative Quranic arch motif in background */}
      <div className="absolute left-0 top-0 bottom-0 w-32 opacity-5 pointer-events-none flex items-center justify-center">
        <BookOpen className="w-28 h-28 text-blue-600" />
      </div>

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172033] dark:text-white">
              القرآن الكريم
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              وردك اليومي — ابدأ من حيث توقفت
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMushaf}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#DCE3EF] dark:border-slate-700 text-[#172033] dark:text-slate-200 hover:border-blue-300 transition-colors shadow-2xs"
        >
          المصحف
        </button>
      </div>

      {/* Current Position & Progress Bar */}
      <div className="my-4 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/60 border border-blue-100 dark:border-blue-950">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 font-bold text-[#172033] dark:text-white">
            <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>سورة {lastRead.surahName}</span>
            <span className="text-blue-600 dark:text-blue-400">· الآية {lastRead.ayahNumber}</span>
          </div>
          <span className="text-[#64748B] dark:text-slate-400 font-medium">
            الجزء {lastRead.juz} (صفحة {lastRead.page})
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            style={{ width: `${juzProgressPercent}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Main Action Button */}
      <button
        onClick={onStartReading}
        className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all duration-150 active:scale-[0.99]"
      >
        <span>ابدأ القراءة</span>
        <ArrowLeft className="w-4 h-4" />
      </button>
    </AppCard>
  );
};
