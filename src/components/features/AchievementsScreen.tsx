import React from 'react';
import { AppCard } from '../common/AppCard';
import { Achievement } from '../../types';
import { storageService } from '../../services/storageService';
import {
  Sparkles,
  Flame,
  Trophy,
  BookOpen,
  CircleDot,
  Crown,
  Sun,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface AchievementsScreenProps {
  onBack?: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onBack }) => {
  const achievements = storageService.getAchievements();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'CircleDot':
        return <CircleDot className="w-5 h-5 text-teal-500" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-slate-400 hover:text-blue-600 p-2 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 transition-colors shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
      )}

      {/* Hero Badge Banner */}
      <div className="p-5 rounded-[24px] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20">
            أوسمة الطاعات
          </span>
          <h2 className="text-xl font-bold mt-2">إنجازاتك الإيمانية</h2>
          <p className="text-xs text-amber-100 mt-1">
            افتتحت {unlockedCount} من {achievements.length} وسام
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Trophy className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {achievements.map((item) => {
          const percent = Math.min(Math.round((item.progress / item.maxProgress) * 100), 100);

          return (
            <AppCard
              key={item.id}
              className={`transition-all ${
                item.unlocked
                  ? 'border-amber-200 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/20 to-white dark:from-amber-950/20 dark:to-[#172033]'
                  : 'opacity-85'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      item.unlocked
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.unlocked ? renderIcon(item.icon) : <Lock className="w-4 h-4 text-slate-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#172033] dark:text-white">
                        {item.title}
                      </h3>
                      {item.unlocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          مكتمل
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-[#64748B] dark:text-slate-400">
                  {item.progress}/{item.maxProgress}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3.5">
                <div
                  style={{ width: `${percent}%` }}
                  className={`h-full transition-all duration-500 ${
                    item.unlocked ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                />
              </div>
            </AppCard>
          );
        })}
      </div>
    </div>
  );
};
