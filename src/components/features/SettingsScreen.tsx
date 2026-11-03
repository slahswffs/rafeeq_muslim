import React, { useState } from 'react';
import { AppCard } from '../common/AppCard';
import { AppSettings, ThemeMode, FontSize, CalcMethod, AsrMethod } from '../../types';
import { CITY_PRESETS, APP_NAME, APP_TAGLINE } from '../../constants';
import { audioService } from '../../services/audioService';
import { storageService } from '../../services/storageService';
import {
  Moon,
  Sun,
  Laptop,
  Type,
  MapPin,
  Clock,
  Bell,
  Code,
  Shield,
  Info,
  Trash2,
  Calendar,
  Check,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenFlutterCode: () => void;
  onOpenQibla: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenFlutterCode,
  onOpenQibla,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState<string | null>(null);

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setLocateMsg('متصفحك لا يدعم تحديد الموقع الجغرافي');
      return;
    }
    setIsLocating(true);
    setLocateMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        onUpdateSettings({
          latitude,
          longitude,
          city: 'الموقع الحالي (GPS)',
          country: 'محدد تلقائياً',
        });
        setLocateMsg('تم تحديد موقعك بدقة بنجاح ✓');
        audioService.vibrate(20);
        audioService.playCompletionSound();
        setTimeout(() => setLocateMsg(null), 3500);
      },
      (err) => {
        setIsLocating(false);
        setLocateMsg('تعذر تحديد الموقع، يرجى اختيار المدينة يدوياً من القائمة');
        setTimeout(() => setLocateMsg(null), 3500);
      },
      { timeout: 8000 }
    );
  };

  const handleResetAllData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط التطبيق ومسح جميع السجلات المحلية؟')) {
      storageService.clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. Theme and Appearance */}
      <AppCard>
        <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-3 flex items-center gap-2">
          <Sun className="w-4 h-4 text-blue-600" />
          <span>المظهر والعرض</span>
        </h3>

        <div className="space-y-3">
          {/* Theme Mode Selector */}
          <div>
            <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-2 font-medium">
              الوضع اللوني
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: 'light' as ThemeMode, label: 'فاتح', icon: Sun },
                { mode: 'dark' as ThemeMode, label: 'داكن', icon: Moon },
                { mode: 'system' as ThemeMode, label: 'تلقائي', icon: Laptop },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = settings.themeMode === t.mode;
                return (
                  <button
                    key={t.mode}
                    onClick={() => {
                      onUpdateSettings({ themeMode: t.mode });
                      audioService.vibrate(15);
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Selector */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-2 font-medium">
              حجم خط النصوص والقرآن
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { size: 'small' as FontSize, label: 'صغير' },
                { size: 'medium' as FontSize, label: 'متوسط' },
                { size: 'large' as FontSize, label: 'كبير' },
                { size: 'xlarge' as FontSize, label: 'ضخم' },
              ].map((f) => (
                <button
                  key={f.size}
                  onClick={() => {
                    onUpdateSettings({ fontSize: f.size });
                    audioService.vibrate(15);
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    settings.fontSize === f.size
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppCard>

      {/* 2. Prayer Times & Location Settings */}
      <AppCard>
        <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>مواقيت الصلاة والموقع</span>
        </h3>

        <div className="space-y-3">
          {/* Current City & Auto Locate */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs text-[#64748B] dark:text-slate-400 block">
                المدينة الحالية
              </span>
              <span className="text-sm font-bold text-[#172033] dark:text-white">
                {settings.city}
              </span>
            </div>

            <button
              onClick={handleAutoLocate}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-700 disabled:opacity-50"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isLocating ? 'جارٍ التحديد...' : 'موقعي الحالي'}</span>
            </button>
          </div>

          {locateMsg && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold text-center">
              {locateMsg}
            </p>
          )}

          {/* Quick City Presets */}
          <div>
            <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-1.5 font-medium">
              أو اختر من المدن الشهيرة
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {CITY_PRESETS.slice(0, 6).map((c) => (
                <button
                  key={c.nameAr}
                  onClick={() => {
                    onUpdateSettings({
                      city: c.nameAr,
                      country: c.countryAr,
                      latitude: c.lat,
                      longitude: c.lng,
                    });
                    audioService.vibrate(15);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border truncate text-center ${
                    settings.city === c.nameAr
                      ? 'bg-blue-50 text-blue-700 border-blue-400 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-white dark:bg-[#172033] border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-300'
                  }`}
                >
                  {c.nameAr}
                </button>
              ))}
            </div>
          </div>

          {/* Asr Juristic Method */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-[#64748B] dark:text-slate-400 block mb-2 font-medium">
              مذهب حساب وقت العصر
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ asrMethod: 'Standard' })}
                className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                  settings.asrMethod === 'Standard'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-300'
                }`}
              >
                الجمهور (شافعي، مالكي، حنبلي)
              </button>
              <button
                onClick={() => onUpdateSettings({ asrMethod: 'Hanafi' })}
                className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                  settings.asrMethod === 'Hanafi'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-300'
                }`}
              >
                المذهب الحنفي (ظل مثلين)
              </button>
            </div>
          </div>

          {/* Hijri Adjustment */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#172033] dark:text-white block">
                تعديل التقويم الهجري
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                حسب رؤية الهلال المحلية
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[-1, 0, 1].map((adj) => (
                <button
                  key={adj}
                  onClick={() => onUpdateSettings({ hijriDayAdjustment: adj })}
                  className={`w-9 h-9 rounded-xl border text-xs font-bold font-mono transition-all ${
                    settings.hijriDayAdjustment === adj
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {adj > 0 ? `+${adj}` : adj}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppCard>

      {/* 3. Flutter & Dart Source Code Button */}
      <AppCard className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-blue-800 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                مشروع Flutter + Dart الكامل
              </h3>
              <p className="text-xs text-blue-200 mt-0.5 leading-relaxed">
                ملفات كود دارت النظيفة (Architecture, Riverpod, Theme) جاهزة للتصدير والتشغيل.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenFlutterCode}
          className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <span>عرض ونسخ كود Flutter</span>
        </button>
      </AppCard>

      {/* 4. Privacy & About */}
      <AppCard>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172033] dark:text-white">
              {APP_NAME}
            </h3>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">
              {APP_TAGLINE} · الإصدار 1.0.0
            </span>
          </div>
        </div>

        <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
          تطبيق إسلامي مصمم ليكون رفيقك اليومي، يعمل بالكامل بدون اتصال بالإنترنت مع حفظ بياناتك وصلواتك بأمان على جهازك فقط وفق أعلى معايير الخصوصية.
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            إعادة الضبط الشاملة
          </span>
          <button
            onClick={handleResetAllData}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 p-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح البيانات</span>
          </button>
        </div>
      </AppCard>
    </div>
  );
};
