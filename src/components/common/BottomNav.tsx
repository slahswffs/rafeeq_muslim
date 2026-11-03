import React from 'react';
import { Home, BookOpen, Heart, CircleDot, Settings } from 'lucide-react';

export type TabKey = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'settings';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabKey, label: 'الرئيسية', icon: Home },
    { id: 'quran' as TabKey, label: 'القرآن', icon: BookOpen },
    { id: 'adhkar' as TabKey, label: 'الأذكار', icon: Heart },
    { id: 'tasbeeh' as TabKey, label: 'السبحة', icon: CircleDot },
    { id: 'settings' as TabKey, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#172033]/95 backdrop-blur-lg border-t border-[#DCE3EF] dark:border-slate-800 px-3 py-2 shadow-lg transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 scale-105'
                    : 'text-[#64748B] dark:text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
