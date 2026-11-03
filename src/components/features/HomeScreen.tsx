import React, { useState } from 'react';
import { WeeklyProgressCard } from '../common/WeeklyProgressCard';
import { TodayPrayerCard } from '../common/TodayPrayerCard';
import { QuranProgressCard } from '../common/QuranProgressCard';
import { DailyChallengeScreen } from './DailyChallengeScreen';
import {
  PrayerTimeItem,
  DayPrayerRecord,
  QuranReadingPosition,
  PrayerId,
} from '../../types';
import { Compass, Clock, Heart, CircleDot } from 'lucide-react';

interface HomeScreenProps {
  prayers: PrayerTimeItem[];
  todayRecord: DayPrayerRecord;
  weekDays: Array<{
    dateStr: string;
    dayLabel: string;
    fullDayName: string;
    isToday: boolean;
    completedCount: number;
  }>;
  nextPrayer: { nextPrayer: PrayerTimeItem; remainingFormatted: string };
  lastRead: QuranReadingPosition;
  onTogglePrayer: (prayerId: PrayerId) => void;
  onSelectDay: (dateStr: string) => void;
  onOpenHistory: () => void;
  onOpenPrayerTimes: () => void;
  onOpenMushaf: () => void;
  onStartReading: () => void;
  onOpenQibla: () => void;
  onOpenAdhkar: () => void;
  onOpenTasbeeh: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  prayers,
  todayRecord,
  weekDays,
  nextPrayer,
  lastRead,
  onTogglePrayer,
  onSelectDay,
  onOpenHistory,
  onOpenPrayerTimes,
  onOpenMushaf,
  onStartReading,
  onOpenQibla,
  onOpenAdhkar,
  onOpenTasbeeh,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'wird' | 'daily'>('wird');

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 2 Main Top Tabs: "وردي اليومي" vs "يومي مع الله" */}
      <div className="grid grid-cols-2 gap-2.5 p-1 rounded-2xl bg-slate-200/50 dark:bg-slate-800/60 border border-[#DCE3EF] dark:border-slate-800">
        <button
          onClick={() => setActiveMainTab('wird')}
          className={`py-3 px-4 rounded-xl text-sm font-extrabold transition-all duration-200 ${
            activeMainTab === 'wird'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-[#172033] text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#DCE3EF] dark:border-slate-800'
          }`}
        >
          وردي اليومي
        </button>

        <button
          onClick={() => setActiveMainTab('daily')}
          className={`py-3 px-4 rounded-xl text-sm font-extrabold transition-all duration-200 ${
            activeMainTab === 'daily'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-[#172033] text-[#64748B] dark:text-slate-400 hover:text-[#172033] dark:hover:text-white border border-[#DCE3EF] dark:border-slate-800'
          }`}
        >
          يومي مع الله
        </button>
      </div>

      {activeMainTab === 'wird' ? (
        <>
          {/* Quick countdown alert for next prayer */}
          <div
            onClick={onOpenPrayerTimes}
            className="p-3.5 rounded-[22px] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-slate-900 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#172033] dark:text-white">
                    الصلاة القادمة: صلاة {nextPrayer.nextPrayer.nameArabic}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    ({nextPrayer.nextPrayer.timeString})
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-medium">
                  متبقي {nextPrayer.remainingFormatted}
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 shadow-2xs">
              التفاصيل
            </span>
          </div>

          {/* Weekly Progress Card */}
          <WeeklyProgressCard
            days={weekDays}
            onSelectDay={onSelectDay}
            onOpenHistory={onOpenHistory}
          />

          {/* Today's Prayers Card */}
          <TodayPrayerCard
            prayers={prayers}
            record={todayRecord}
            nextPrayerId={nextPrayer.nextPrayer.id}
            onTogglePrayer={onTogglePrayer}
            onOpenPrayerTimes={onOpenPrayerTimes}
          />

          {/* Quran Progress Card */}
          <QuranProgressCard
            lastRead={lastRead}
            onStartReading={onStartReading}
            onOpenMushaf={onOpenMushaf}
          />

          {/* Quick Access Action Shortcuts Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <button
              onClick={onOpenPrayerTimes}
              className="p-3 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors shadow-2xs active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200">
                المواقيت
              </span>
            </button>

            <button
              onClick={onOpenQibla}
              className="p-3 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors shadow-2xs active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1.5">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200">
                القبلة
              </span>
            </button>

            <button
              onClick={onOpenAdhkar}
              className="p-3 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors shadow-2xs active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200">
                الأذكار
              </span>
            </button>

            <button
              onClick={onOpenTasbeeh}
              className="p-3 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors shadow-2xs active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5">
                <CircleDot className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-[#172033] dark:text-slate-200">
                السبحة
              </span>
            </button>
          </div>
        </>
      ) : (
        /* Daily Challenge Tab ("يومي مع الله") */
        <DailyChallengeScreen
          todayPrayerRecord={todayRecord}
          onOpenQuran={onOpenMushaf}
          onOpenAdhkar={onOpenAdhkar}
          onOpenTasbeeh={onOpenTasbeeh}
        />
      )}
    </div>
  );
};
