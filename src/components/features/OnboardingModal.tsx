import React, { useState } from 'react';
import { AppSettings, CityPreset } from '../../types';
import { CITY_PRESETS, APP_NAME, APP_TAGLINE } from '../../constants';
import { audioService } from '../../services/audioService';
import {
  Sparkles,
  BookOpen,
  Heart,
  Clock,
  MapPin,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface OnboardingModalProps {
  settings: AppSettings;
  onFinish: (selectedSettings: Partial<AppSettings>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  settings,
  onFinish,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITY_PRESETS[0]);
  const [step, setStep] = useState<1 | 2>(1);

  const handleComplete = () => {
    audioService.playCompletionSound();
    audioService.triggerConfetti();
    onFinish({
      city: selectedCity.nameAr,
      country: selectedCity.countryAr,
      latitude: selectedCity.lat,
      longitude: selectedCity.lng,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#F5F7FB] dark:bg-[#0F172A] w-full max-w-md rounded-[32px] border border-[#DCE3EF] dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        {step === 1 ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Logo Emblem */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Sparkles className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                مرحباً بك في
              </span>
              <h1 className="text-2xl font-black text-[#172033] dark:text-white mt-1">
                {APP_NAME}
              </h1>
              <p className="text-sm font-medium text-[#64748B] dark:text-slate-400 mt-2">
                {APP_TAGLINE}
              </p>
            </div>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-2 gap-3 text-right">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172033] dark:text-white block">صلاتك</span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">مواقيت وتتبع</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172033] dark:text-white block">قرآنك</span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">ورد وتلاوة</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172033] dark:text-white block">أذكارك</span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">حصنك اليومي</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172033] dark:text-white block">وردك اليومي</span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">إنجاز مستمر</span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setStep(2);
                  audioService.vibrate(15);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>المتابعة وضبط المدينة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#172033] dark:text-white">
                اختر مدينتك لمواقيت الصلاة
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                تُحسب المواقيت فلكياً بدقة وفق إحداثيات مدينتك
              </p>
            </div>

            {/* City Options List */}
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar p-1">
              {CITY_PRESETS.map((city) => {
                const isSelected = selectedCity.nameAr === city.nameAr;
                return (
                  <button
                    key={city.nameAr}
                    onClick={() => {
                      setSelectedCity(city);
                      audioService.vibrate(10);
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold text-right border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 text-[#172033] dark:text-slate-300 hover:border-blue-200'
                    }`}
                  >
                    <span>{city.nameAr}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleComplete}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>ابدأ رحلتك الإيمانية</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => {
                  onFinish({ onboardingCompleted: true });
                }}
                className="w-full py-2.5 text-xs font-bold text-[#64748B] hover:text-[#172033] dark:hover:text-white transition-colors"
              >
                تخطي والمتابعة بالإعدادات الافتراضية
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
