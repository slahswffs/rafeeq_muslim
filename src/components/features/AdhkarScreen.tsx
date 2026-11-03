import React, { useState } from 'react';
import { AppCard } from '../common/AppCard';
import { ADHKAR_CATEGORIES } from '../../data/adhkarData';
import { DhikrCategory, DhikrItem } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import {
  Sun,
  Moon,
  Sparkles,
  Bed,
  Sunrise,
  Compass,
  ShieldCheck,
  HeartHandshake,
  Check,
  RotateCcw,
  Share2,
  Copy,
} from 'lucide-react';

export const AdhkarScreen: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('morning');
  const [progress, setProgress] = useState<Record<string, number>>(() =>
    storageService.getAdhkarProgress()
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeCategory =
    ADHKAR_CATEGORIES.find((c) => c.id === activeCategoryId) || ADHKAR_CATEGORIES[0];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'Bed':
        return <Bed className="w-4 h-4 text-purple-500" />;
      case 'Sunrise':
        return <Sunrise className="w-4 h-4 text-orange-500" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-teal-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-rose-500" />;
    }
  };

  const handleIncrement = (item: DhikrItem) => {
    const current = progress[item.id] || 0;
    if (current < item.count) {
      const nextCount = current + 1;
      const updated = { ...progress, [item.id]: nextCount };
      setProgress(updated);
      storageService.saveAdhkarItemCount(item.id, nextCount);

      audioService.vibrate(20);
      audioService.playBeadSound();

      if (nextCount === item.count) {
        audioService.playCompletionSound();
        // Check if all in this category are completed
        const allCompleted = activeCategory.items.every(
          (it) => (it.id === item.id ? nextCount : (progress[it.id] || 0)) >= it.count
        );
        if (allCompleted) {
          audioService.triggerConfetti();
          storageService.updateAchievement('adhkar_complete', 1);
        }
      }
    }
  };

  const handleReset = (item: DhikrItem) => {
    const updated = { ...progress, [item.id]: 0 };
    setProgress(updated);
    storageService.saveAdhkarItemCount(item.id, 0);
    audioService.vibrate(15);
  };

  const handleCopy = (item: DhikrItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${item.text}\n(${item.reference || ''})`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      audioService.vibrate(15);
    }
  };

  const handleShare = (item: DhikrItem) => {
    if (navigator.share) {
      navigator.share({
        title: activeCategory.title,
        text: `${item.text}\n— تطبيق رفيق المسلم`,
      }).catch(() => {});
    } else {
      handleCopy(item);
    }
  };

  // Calculate completion percentage for active category
  const completedItemsCount = activeCategory.items.filter(
    (it) => (progress[it.id] || 0) >= it.count
  ).length;
  const categoryPercentage = Math.round(
    (completedItemsCount / (activeCategory.items.length || 1)) * 100
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {ADHKAR_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                audioService.vibrate(10);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 text-[#172033] dark:text-slate-300 hover:border-blue-200'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Category Header Card */}
      <div className="p-4 rounded-[22px] bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">{activeCategory.title}</h2>
          <p className="text-xs text-blue-100 mt-0.5">{activeCategory.description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-xs">
          <span>{categoryPercentage}% مكتمل</span>
        </div>
      </div>

      {/* Dhikr Cards List */}
      <div className="space-y-3">
        {activeCategory.items.map((item) => {
          const count = progress[item.id] || 0;
          const isDone = count >= item.count;
          const progressPercent = Math.min(Math.round((count / item.count) * 100), 100);

          return (
            <AppCard key={item.id} className="relative overflow-hidden">
              {/* Top info & badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-300">
                  {item.reference || 'مأثور'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="نسخ الذكر"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleShare(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="مشاركة الذكر"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dhikr Text */}
              <div className="py-2 text-right">
                <p className="text-base md:text-lg font-bold leading-relaxed text-[#172033] dark:text-slate-100">
                  {item.text}
                </p>
                {item.fadl && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 bg-blue-50/60 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100/80 dark:border-blue-900/40">
                    <span className="font-bold">الفضل: </span> {item.fadl}
                  </p>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden my-3">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`h-full transition-all duration-300 ${
                    isDone ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                />
              </div>

              {/* Counter Action Footer */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#172033] dark:text-white font-mono">
                    {count}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">
                    / {item.count}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <button
                      onClick={() => handleReset(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="إعادة التصفير"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleIncrement(item)}
                    disabled={isDone}
                    className={`py-2 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                      isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>اكتمل الذكر</span>
                      </>
                    ) : (
                      <span>تسبيح</span>
                    )}
                  </button>
                </div>
              </div>
            </AppCard>
          );
        })}
      </div>
    </div>
  );
};
