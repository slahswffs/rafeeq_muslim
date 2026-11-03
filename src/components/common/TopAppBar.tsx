import React from 'react';
import { Compass, Award, Smartphone, Monitor } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { HijriDateInfo } from '../../services/hijriService';

interface TopAppBarProps {
  hijriInfo: HijriDateInfo;
  cityName: string;
  onOpenQibla: () => void;
  onOpenAchievements: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  hijriInfo,
  cityName,
  onOpenQibla,
  onOpenAchievements,
  isMobileFrame,
  onToggleFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F5F7FB]/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-[#DCE3EF]/60 dark:border-slate-800/80 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* App Branding & Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#172033] dark:text-white leading-tight">
                {APP_NAME}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                {cityName}
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
              {hijriInfo.formatted}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenQibla}
            title="اتجاه القبلة"
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center justify-center text-[#64748B] dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors shadow-xs active:scale-95"
            aria-label="اتجاه القبلة"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAchievements}
            title="الإنجازات الإيمانية"
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center justify-center text-[#64748B] dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-300 transition-colors shadow-xs active:scale-95"
            aria-label="الإنجازات"
          >
            <Award className="w-4 h-4" />
          </button>

          {/* Toggle Device Frame / Responsive View */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? 'عرض ملء الشاشة' : 'عرض محاكي هاتف أندرويد'}
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center justify-center text-[#64748B] dark:text-slate-300 hover:text-blue-600 transition-colors shadow-xs active:scale-95 hidden sm:flex"
            aria-label="تبديل وضع العرض"
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
