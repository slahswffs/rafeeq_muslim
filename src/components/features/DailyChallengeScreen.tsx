import React, { useState, useEffect } from 'react';
import { AppCard } from '../common/AppCard';
import { DayPrayerRecord } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import {
  Check,
  Sparkles,
  BookOpen,
  Heart,
  CircleDot,
  Coins,
  Smile,
  Award,
} from 'lucide-react';

interface DailyChallengeScreenProps {
  todayPrayerRecord: DayPrayerRecord;
  onOpenQuran: () => void;
  onOpenAdhkar: () => void;
  onOpenTasbeeh: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({
  todayPrayerRecord,
  onOpenQuran,
  onOpenAdhkar,
  onOpenTasbeeh,
}) => {
  const [checklist, setChecklist] = useState(() => storageService.getDailyChecklist());
  const tasbeehState = storageService.getTasbeehState();

  useEffect(() => {
    storageService.saveDailyChecklist(checklist);
  }, [checklist]);

  const prayersDone = todayPrayerRecord.completedCount;
  const isPrayersFull = prayersDone >= 5;
  const isQuranDone = checklist.quranRead;
  const isMorningDone = checklist.adhkarMorningDone;
  const isEveningDone = checklist.adhkarEveningDone;
  const isTasbeehDone = checklist.tasbeehGoalDone || tasbeehState.currentCount >= 100;
  const isSadaqahDone = checklist.sadaqahDone;
  const isExtraDuaDone = checklist.extraDuaDone;

  // Weightings:
  // Prayers: 40% (8% each)
  // Quran: 20%
  // Adhkar (Morning & Evening): 15%
  // Tasbeeh: 15%
  // Sadaqah: 10%
  const scorePrayers = (prayersDone / 5) * 40;
  const scoreQuran = isQuranDone ? 20 : 0;
  const scoreAdhkar = (isMorningDone ? 7.5 : 0) + (isEveningDone ? 7.5 : 0);
  const scoreTasbeeh = isTasbeehDone ? 15 : Math.min((tasbeehState.currentCount / 100) * 15, 15);
  const scoreSadaqah = isSadaqahDone ? 10 : 0;

  const totalProgress = Math.min(
    Math.round(scorePrayers + scoreQuran + scoreAdhkar + scoreTasbeeh + scoreSadaqah),
    100
  );

  const toggleCheck = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    audioService.vibrate(20);
    audioService.playBeadSound();

    if (!checklist[key]) {
      audioService.playCompletionSound();
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Progress Circle & Status Hero Card */}
      <AppCard className="bg-gradient-to-br from-white to-blue-50/50 dark:from-[#172033] dark:to-blue-950/20 py-6 text-center relative overflow-hidden">
        <div className="flex flex-col items-center justify-center">
          {/* Circular SVG Indicator */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-blue-600 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * (1 - totalProgress / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-[#172033] dark:text-white font-mono">
                {totalProgress}%
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                إنجاز اليوم
              </span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#172033] dark:text-white mt-2">
            {totalProgress === 100
              ? 'مبارك! أتممت جميع أورادك اليوم 🌟'
              : totalProgress >= 70
              ? 'إنجاز إيماني مبارك، واصل الطاعة'
              : 'بداية مباركة، بارك الله في وقتك ووردك'}
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-xs mt-1">
            "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ"
          </p>
        </div>
      </AppCard>

      {/* Spiritual Checklist Items */}
      <AppCard>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#172033] dark:text-white">
            قائمة الطاعات والأوراد اليومية
          </h3>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            اليوم
          </span>
        </div>

        <div className="space-y-2.5">
          {/* 1. Prayers */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isPrayersFull
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#172033] dark:text-white block">
                  الصلوات المفروضة
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                  سجلت {prayersDone} من 5 صلوات
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                isPrayersFull
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {prayersDone} / 5
            </span>
          </div>

          {/* 2. Quran Reading */}
          <div
            onClick={() => toggleCheck('quranRead')}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isQuranDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#172033] dark:text-white block">
                  ورد القرآن الكريم
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                  قراءة حزب أو جزء من كتاب الله
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isQuranDone
                  ? 'bg-blue-600 text-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}
            >
              {isQuranDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* 3. Morning Adhkar */}
          <div
            onClick={() => toggleCheck('adhkarMorningDone')}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isMorningDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                }`}
              >
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#172033] dark:text-white block">
                  أذكار الصباح
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                  حصنك الإيماني الصباحي
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isMorningDone
                  ? 'bg-blue-600 text-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}
            >
              {isMorningDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* 4. Evening Adhkar */}
          <div
            onClick={() => toggleCheck('adhkarEveningDone')}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isEveningDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                }`}
              >
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#172033] dark:text-white block">
                  أذكار المساء
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                  حفظ وطمأنينة المساء
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isEveningDone
                  ? 'bg-blue-600 text-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}
            >
              {isEveningDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* 5. Tasbeeh Goal */}
          <div
            onClick={() => toggleCheck('tasbeehGoalDone')}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isTasbeehDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400'
                }`}
              >
                <CircleDot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#172033] dark:text-white block">
                  تسبيح واستغفار (100)
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                  الحالي: {tasbeehState.currentCount} تسبيحة
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isTasbeehDone
                  ? 'bg-blue-600 text-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}
            >
              {isTasbeehDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* 6. Sadaqah / Smile */}
          <div
            onClick={() => toggleCheck('sadaqahDone')}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSadaqahDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                }`}
              >
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#172033] dark:text-white block">
                  صدقة أو إحسان اليوم
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                  مال أو كلمة طيبة أو ابتسامة
                </span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isSadaqahDone
                  ? 'bg-blue-600 text-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}
            >
              {isSadaqahDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  );
};
