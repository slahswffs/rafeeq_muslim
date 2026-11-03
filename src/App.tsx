import React, { useState, useEffect, useMemo } from 'react';
import { TopAppBar } from './components/common/TopAppBar';
import { BottomNav, TabKey } from './components/common/BottomNav';
import { HomeScreen } from './components/features/HomeScreen';
import { QuranScreen } from './components/features/QuranScreen';
import { AdhkarScreen } from './components/features/AdhkarScreen';
import { TasbeehScreen } from './components/features/TasbeehScreen';
import { SettingsScreen } from './components/features/SettingsScreen';
import { PrayerTimesScreen } from './components/features/PrayerTimesScreen';
import { QiblaScreen } from './components/features/QiblaScreen';
import { AchievementsScreen } from './components/features/AchievementsScreen';
import { PrayerHistoryModal } from './components/features/PrayerHistoryModal';
import { OnboardingModal } from './components/features/OnboardingModal';
import { FlutterCodeModal } from './components/features/FlutterCodeModal';
import { calculatePrayerTimes, getNextPrayer } from './services/prayerService';
import { getHijriDate } from './services/hijriService';
import { storageService, getTodayKey } from './services/storageService';
import { audioService } from './services/audioService';
import { AppSettings, PrayerId, QuranReadingPosition } from './types';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [overlayView, setOverlayView] = useState<'prayerTimes' | 'qibla' | 'achievements' | null>(null);
  const [historyModalDate, setHistoryModalDate] = useState<string | null>(null);
  const [showFlutterCodeModal, setShowFlutterCodeModal] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Today's prayer records & Quran position
  const [todayRecord, setTodayRecord] = useState(() => storageService.getDayPrayerRecord());
  const [allPrayerRecords, setAllPrayerRecords] = useState(() => storageService.getAllPrayerRecords());
  const [lastReadPosition, setLastReadPosition] = useState<QuranReadingPosition>(() =>
    storageService.getLastReadPosition()
  );

  // Clock ticker for next prayer countdown
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync theme mode to DOM
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.themeMode === 'dark' ||
      (settings.themeMode === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.themeMode]);

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  // Astronomical Prayer Times
  const prayers = useMemo(() => {
    return calculatePrayerTimes(
      currentTime,
      settings.latitude,
      settings.longitude,
      settings.calcMethod,
      settings.asrMethod
    );
  }, [currentTime.getDate(), settings.latitude, settings.longitude, settings.calcMethod, settings.asrMethod]);

  // Next prayer
  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayers, currentTime);
  }, [prayers, currentTime]);

  // Hijri Date
  const hijriInfo = useMemo(() => {
    return getHijriDate(currentTime, settings.hijriDayAdjustment);
  }, [currentTime.getDate(), settings.hijriDayAdjustment]);

  // Build the 7 Days Array for WeeklyProgressCard:
  // Arabic day labels: ر، خ، ج، س، ح، ن، اليوم
  const weekDays = useMemo(() => {
    const dayLabelsMap = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
    const fullNamesMap = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const list = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(currentTime);
      d.setDate(d.getDate() - i);
      const yr = d.getFullYear();
      const mo = (d.getMonth() + 1).toString().padStart(2, '0');
      const dy = d.getDate().toString().padStart(2, '0');
      const dateStr = `${yr}-${mo}-${dy}`;
      const isToday = i === 0;

      const rec = allPrayerRecords[dateStr];
      const count = rec ? rec.completedCount : 0;

      list.push({
        dateStr,
        dayLabel: dayLabelsMap[d.getDay()],
        fullDayName: fullNamesMap[d.getDay()],
        isToday,
        completedCount: count,
      });
    }
    return list;
  }, [currentTime.getDate(), allPrayerRecords]);

  // Toggle prayer checkbox
  const handleTogglePrayer = (prayerId: PrayerId, targetDate: string = getTodayKey()) => {
    const updatedRecord = storageService.togglePrayer(prayerId, targetDate);
    const updatedAll = storageService.getAllPrayerRecords();

    setTodayRecord(updatedRecord);
    setAllPrayerRecords(updatedAll);

    audioService.vibrate(25);
    audioService.playBeadSound();

    // Check achievement for first prayer
    storageService.updateAchievement('first_prayer', 1);

    // If 5 prayers completed today
    if (updatedRecord.completedCount === 5) {
      audioService.playCompletionSound();
      audioService.triggerConfetti();
      storageService.updateAchievement('streak_3_days', 1);
    }
  };

  const handleUpdateLastRead = (pos: QuranReadingPosition) => {
    setLastReadPosition(pos);
    storageService.saveLastReadPosition(pos);
    storageService.updateAchievement('first_juz', 1);
  };

  return (
    <div
      className={`min-h-screen bg-[#F5F7FB] dark:bg-[#0F172A] text-[#172033] dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-100 selection:text-blue-900 ${
        settings.fontSize === 'small'
          ? 'text-sm'
          : settings.fontSize === 'large'
          ? 'text-lg'
          : settings.fontSize === 'xlarge'
          ? 'text-xl'
          : 'text-base'
      }`}
    >
      {/* Onboarding Dialog if first launch */}
      {!settings.onboardingCompleted && (
        <OnboardingModal
          settings={settings}
          onFinish={(selected) => handleUpdateSettings(selected)}
        />
      )}

      {/* Flutter Source Code Modal */}
      {showFlutterCodeModal && (
        <FlutterCodeModal onClose={() => setShowFlutterCodeModal(false)} />
      )}

      {/* Prayer History Calendar Modal */}
      {historyModalDate && (
        <PrayerHistoryModal
          records={allPrayerRecords}
          selectedDateStr={historyModalDate}
          onSelectDate={(d) => setHistoryModalDate(d)}
          onTogglePrayerForDate={(pId, d) => handleTogglePrayer(pId, d)}
          onClose={() => setHistoryModalDate(null)}
        />
      )}

      {/* Outer Shell Wrapper (with responsive phone frame option) */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col ${
          isMobileFrame
            ? 'max-w-md my-4 rounded-[40px] border-8 border-slate-800 dark:border-slate-700 shadow-2xl overflow-hidden bg-[#F5F7FB] dark:bg-[#0F172A]'
            : 'max-w-2xl'
        }`}
      >
        {/* Android Phone Status Bar when Mobile Frame active */}
        {isMobileFrame && (
          <div className="bg-slate-900 text-white text-[11px] px-6 py-1.5 flex items-center justify-between font-mono select-none">
            <span>
              {currentTime.getHours().toString().padStart(2, '0')}:
              {currentTime.getMinutes().toString().padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top AppBar */}
        <TopAppBar
          hijriInfo={hijriInfo}
          cityName={settings.city}
          onOpenQibla={() => setOverlayView('qibla')}
          onOpenAchievements={() => setOverlayView('achievements')}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Main View Area */}
        <main className="flex-1 px-4 py-4">
          {/* Overlays / Full Screen features */}
          {overlayView === 'prayerTimes' ? (
            <PrayerTimesScreen
              prayers={prayers}
              nextPrayer={nextPrayer}
              hijriInfo={hijriInfo}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onBack={() => setOverlayView(null)}
            />
          ) : overlayView === 'qibla' ? (
            <QiblaScreen settings={settings} onBack={() => setOverlayView(null)} />
          ) : overlayView === 'achievements' ? (
            <AchievementsScreen onBack={() => setOverlayView(null)} />
          ) : activeTab === 'home' ? (
            /* Home Tab */
            <HomeScreen
              prayers={prayers}
              todayRecord={todayRecord}
              weekDays={weekDays}
              nextPrayer={nextPrayer}
              lastRead={lastReadPosition}
              onTogglePrayer={(pId) => handleTogglePrayer(pId)}
              onSelectDay={(d) => setHistoryModalDate(d)}
              onOpenHistory={() => setHistoryModalDate(getTodayKey())}
              onOpenPrayerTimes={() => setOverlayView('prayerTimes')}
              onOpenMushaf={() => setActiveTab('quran')}
              onStartReading={() => setActiveTab('quran')}
              onOpenQibla={() => setOverlayView('qibla')}
              onOpenAdhkar={() => setActiveTab('adhkar')}
              onOpenTasbeeh={() => setActiveTab('tasbeeh')}
            />
          ) : activeTab === 'quran' ? (
            /* Quran Tab */
            <QuranScreen
              lastRead={lastReadPosition}
              onUpdateLastRead={handleUpdateLastRead}
            />
          ) : activeTab === 'adhkar' ? (
            /* Adhkar Tab */
            <AdhkarScreen />
          ) : activeTab === 'tasbeeh' ? (
            /* Tasbeeh Tab */
            <TasbeehScreen />
          ) : (
            /* Settings Tab */
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onOpenFlutterCode={() => setShowFlutterCodeModal(true)}
              onOpenQibla={() => setOverlayView('qibla')}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        {!overlayView && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              audioService.vibrate(10);
            }}
          />
        )}
      </div>
    </div>
  );
}
