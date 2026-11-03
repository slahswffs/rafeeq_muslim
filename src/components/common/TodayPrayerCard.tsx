import React from 'react';
import { AppCard } from './AppCard';
import { PrayerId, PrayerTimeItem, DayPrayerRecord } from '../../types';
import { Check, Clock, ChevronLeft } from 'lucide-react';

interface TodayPrayerCardProps {
  prayers: PrayerTimeItem[];
  record: DayPrayerRecord;
  nextPrayerId?: PrayerId;
  onTogglePrayer: (prayerId: PrayerId) => void;
  onOpenPrayerTimes: () => void;
}

export const TodayPrayerCard: React.FC<TodayPrayerCardProps> = ({
  prayers,
  record,
  nextPrayerId,
  onTogglePrayer,
  onOpenPrayerTimes,
}) => {
  // We only show the 5 obligatory prayers here as specified: Fajr, Dhuhr, Asr, Maghrib, Isha
  const fivePrayers = prayers.filter((p) => p.id !== 'sunrise');
  const completedCount = record.completedCount;

  return (
    <AppCard>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mt-0.5">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172033] dark:text-white">
                صلواتي اليوم
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {completedCount} من 5
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              سجّل صلاتك بلطف، من دون ضغط أو ذنب
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPrayerTimes}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 p-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>المواقيت</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Prayers List */}
      <div className="space-y-2">
        {fivePrayers.map((prayer) => {
          const isCompleted = !!record.prayers[prayer.id];
          const isNext = prayer.id === nextPrayerId;

          return (
            <div
              key={prayer.id}
              onClick={() => onTogglePrayer(prayer.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
                isCompleted
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/60'
                  : isNext
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-xs'
                  : 'bg-white dark:bg-slate-900/40 border-[#DCE3EF] dark:border-slate-800 hover:border-blue-200'
              }`}
            >
              {/* Right side: Checkbox + Prayer Name */}
              <div className="flex items-center gap-3">
                {/* Circular Checkbox */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30 ring-2 ring-blue-600/20'
                      : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isCompleted
                          ? 'text-blue-950 dark:text-blue-100 line-through opacity-85'
                          : 'text-[#172033] dark:text-white'
                      }`}
                    >
                      {prayer.nameArabic}
                    </span>
                    {isNext && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        القادمة
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                    {isCompleted ? 'تمت بحمد الله' : 'في انتظار الأداء'}
                  </span>
                </div>
              </div>

              {/* Left side: Time String */}
              <div className="text-left">
                <span
                  className={`text-sm font-semibold tracking-wide ${
                    isCompleted
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-[#172033] dark:text-slate-200'
                  }`}
                >
                  {prayer.timeString}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AppCard>
  );
};
