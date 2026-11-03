import React, { useState } from 'react';
import { AppCard } from '../common/AppCard';
import { PrayerTimeItem, PrayerId, AppSettings, CalcMethod } from '../../types';
import { HijriDateInfo } from '../../services/hijriService';
import { CITY_PRESETS } from '../../constants';
import { audioService } from '../../services/audioService';
import { Bell, BellOff, MapPin, Volume2, ArrowRight, Check } from 'lucide-react';

interface PrayerTimesScreenProps {
  prayers: PrayerTimeItem[];
  nextPrayer: { nextPrayer: PrayerTimeItem; remainingFormatted: string };
  hijriInfo: HijriDateInfo;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({
  prayers,
  nextPrayer,
  hijriInfo,
  settings,
  onUpdateSettings,
  onBack,
}) => {
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCalcPicker, setShowCalcPicker] = useState(false);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);

  const toggleNotification = (prayerId: PrayerId) => {
    const updated = {
      ...settings.notificationsEnabled,
      [prayerId]: !settings.notificationsEnabled[prayerId],
    };
    onUpdateSettings({ notificationsEnabled: updated });
    audioService.vibrate(20);
  };

  const handlePlayAdhanPreview = () => {
    setIsPlayingAdhan(true);
    audioService.playCompletionSound();
    setTimeout(() => setIsPlayingAdhan(false), 2000);
  };

  const calcMethods: Array<{ key: CalcMethod; label: string }> = [
    { key: 'Makkah', label: 'أم القرى (مكة المكرمة)' },
    { key: 'MWL', label: 'رابطة العالم الإسلامي' },
    { key: 'Egypt', label: 'الهيئة المصرية العامة للمساحة' },
    { key: 'ISNA', label: 'الجمعية الإسلامية لأمريكا الشمالية' },
    { key: 'Karachi', label: 'جامعة العلوم الإسلامية بكراتشي' },
    { key: 'Dubai', label: 'دائرة الشؤون الإسلامية بدبي' },
  ];

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-slate-400 hover:text-blue-600 p-2 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 transition-colors shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <button
          onClick={handlePlayAdhanPreview}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            isPlayingAdhan
              ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
              : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 text-blue-600 dark:text-blue-400'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>تجربة التكبير</span>
        </button>
      </div>

      {/* Hero Banner: Next Prayer Countdown */}
      <div className="rounded-[26px] bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              الصلاة القادمة
            </span>
            <span className="text-xs text-blue-100 font-medium">
              {hijriInfo.weekdayName} · {hijriInfo.gregorianFormatted}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                صلاة {nextPrayer.nextPrayer.nameArabic}
              </h1>
              <p className="text-sm text-blue-100 mt-1 font-medium">
                في تمام الساعة {nextPrayer.nextPrayer.timeString}
              </p>
            </div>
            <div className="text-left">
              <span className="text-xs text-blue-200 block">المتبقي للأذان</span>
              <span className="text-2xl font-black font-mono tracking-wider">
                {nextPrayer.remainingFormatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Calculation selector bar */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowCityPicker(!showCityPicker)}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center justify-between text-right hover:border-blue-300 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="text-[11px] text-[#64748B] dark:text-slate-400 block font-medium">
                المدينة
              </span>
              <span className="text-xs font-bold text-[#172033] dark:text-white truncate block max-w-[120px]">
                {settings.city}
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowCalcPicker(!showCalcPicker)}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 flex items-center justify-between text-right hover:border-blue-300 transition-colors shadow-2xs"
        >
          <div>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400 block font-medium">
              طريقة الحساب
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate block max-w-[130px]">
              {calcMethods.find((m) => m.key === settings.calcMethod)?.label.split(' ')[0] || 'أم القرى'}
            </span>
          </div>
        </button>
      </div>

      {/* City Picker Modal / Drawer */}
      {showCityPicker && (
        <AppCard className="animate-in fade-in zoom-in-95 duration-150">
          <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-2">
            اختر المدينة لمواقيت دقيقة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar pt-1">
            {CITY_PRESETS.map((city) => (
              <button
                key={city.nameAr}
                onClick={() => {
                  onUpdateSettings({
                    city: city.nameAr,
                    country: city.countryAr,
                    latitude: city.lat,
                    longitude: city.lng,
                  });
                  setShowCityPicker(false);
                }}
                className={`p-2 rounded-xl text-xs font-bold border transition-all text-right ${
                  settings.city === city.nameAr
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-200'
                }`}
              >
                {city.nameAr}
              </button>
            ))}
          </div>
        </AppCard>
      )}

      {/* Calc Method Picker */}
      {showCalcPicker && (
        <AppCard className="animate-in fade-in zoom-in-95 duration-150">
          <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-2">
            طريقة حساب المواقيت الفلكية
          </h3>
          <div className="space-y-1.5">
            {calcMethods.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  onUpdateSettings({ calcMethod: m.key });
                  setShowCalcPicker(false);
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  settings.calcMethod === m.key
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#172033] dark:text-slate-300'
                }`}
              >
                <span>{m.label}</span>
                {settings.calcMethod === m.key && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </AppCard>
      )}

      {/* All 6 Prayer Times List */}
      <AppCard>
        <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-3">
          جدول مواقيت اليوم
        </h3>
        <div className="space-y-2">
          {prayers.map((prayer) => {
            const isNext = prayer.id === nextPrayer.nextPrayer.id;
            const notifOn = settings.notificationsEnabled[prayer.id];

            return (
              <div
                key={prayer.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-1 ring-blue-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-900/30 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isNext ? 'bg-blue-600 animate-ping' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#172033] dark:text-white">
                        {prayer.nameArabic}
                      </span>
                      {isNext && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                          الصلاة القادمة
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold font-mono text-[#172033] dark:text-slate-100">
                    {prayer.timeString}
                  </span>

                  {prayer.id !== 'sunrise' && (
                    <button
                      onClick={() => toggleNotification(prayer.id)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        notifOn
                          ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                          : 'bg-white text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                      }`}
                      title={notifOn ? 'الإشعار مفعّل' : 'تفعيل الإشعار'}
                    >
                      {notifOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AppCard>
    </div>
  );
};
