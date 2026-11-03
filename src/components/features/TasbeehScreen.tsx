import React, { useState, useEffect } from 'react';
import { AppCard } from '../common/AppCard';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import { RotateCcw, Volume2, VolumeX, Smartphone, Check, Sparkles } from 'lucide-react';

const TASBEEH_PRESETS = [
  'سبحان الله وبحمده',
  'سُبْحَانَ اللَّهِ',
  'الْحَمْدُ لِلَّهِ',
  'اللَّهُ أَكْبَرُ',
  'لَا إِلَهَ إِلَّا اللَّهُ',
  'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
  'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِهِ',
  'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
];

export const TasbeehScreen: React.FC = () => {
  const [state, setState] = useState(() => storageService.getTasbeehState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    storageService.saveTasbeehState(state);
  }, [state]);

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = state.currentCount + 1;
    const nextLifetime = state.totalLifetime + 1;

    if (soundEnabled) {
      audioService.playBeadSound();
    }
    if (vibrateEnabled) {
      audioService.vibrate(25);
    }

    // Check target reached
    if (state.target > 0 && nextCount % state.target === 0) {
      audioService.playCompletionSound();
      audioService.triggerConfetti();
      if (vibrateEnabled) audioService.vibrate([40, 60, 40]);
    }

    // Check achievement for 100 and 1000 tasbeeh
    if (nextLifetime === 100) {
      storageService.updateAchievement('tasbeeh_100', 100);
    } else if (nextLifetime === 1000) {
      storageService.updateAchievement('tasbeeh_1000', 1000);
    }

    setState({
      ...state,
      currentCount: nextCount,
      totalLifetime: nextLifetime,
    });
  };

  const handleReset = () => {
    setState({
      ...state,
      currentCount: 0,
    });
    audioService.vibrate(15);
  };

  const handleSelectDhikr = (dhikr: string) => {
    setState({
      ...state,
      dhikrText: dhikr,
      currentCount: 0,
    });
    audioService.vibrate(15);
  };

  const handleSelectTarget = (target: number) => {
    setState({
      ...state,
      target,
    });
    audioService.vibrate(15);
  };

  const progressPercent =
    state.target > 0 ? Math.min(Math.round(((state.currentCount % state.target) / state.target) * 100), 100) : 100;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Controls: Sound, Vibration, Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setVibrateEnabled(!vibrateEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              vibrateEnabled
                ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 text-slate-400'
            }`}
            title={vibrateEnabled ? 'إيقاف الاهتزاز' : 'تفعيل الاهتزاز'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Target Buttons */}
        <div className="flex items-center gap-1 bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 p-1 rounded-2xl">
          {[33, 100, 0].map((t) => (
            <button
              key={t}
              onClick={() => handleSelectTarget(t)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                state.target === t
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-blue-600'
              }`}
            >
              {t === 0 ? 'حر' : t}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 text-[#64748B] dark:text-slate-400 hover:text-rose-600 transition-colors"
          title="إعادة التصفير"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Tasbeeh Card */}
      <AppCard className="text-center py-6 relative overflow-hidden flex flex-col items-center justify-center">
        {/* Selected Dhikr Name */}
        <div className="mb-4 max-w-sm px-4">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold block mb-1">
            الذكر الحالي
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#172033] dark:text-white">
            {state.dhikrText}
          </h2>
        </div>

        {/* Counter Digital Display */}
        <div className="relative my-4 flex flex-col items-center">
          <div className="text-6xl md:text-7xl font-black tracking-tight text-[#172033] dark:text-white font-mono select-none">
            {state.currentCount}
          </div>
          {state.target > 0 && (
            <div className="mt-2 text-xs font-bold text-[#64748B] dark:text-slate-400 flex items-center gap-1">
              <span>الهدف: {state.target}</span>
              <span>·</span>
              <span>الدورة: {Math.floor(state.currentCount / state.target) + 1}</span>
            </div>
          )}
        </div>

        {/* Giant Circular Button */}
        <div className="my-6 relative flex items-center justify-center">
          {/* Circular progress track around button */}
          <svg className="w-56 h-56 transform -rotate-90 select-none pointer-events-none">
            <circle
              cx="112"
              cy="112"
              r="100"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            {state.target > 0 && (
              <circle
                cx="112"
                cy="112"
                r="100"
                className="stroke-blue-600 transition-all duration-300"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            )}
          </svg>

          {/* Huge Button "سبّح" */}
          <button
            onClick={handleTap}
            className={`absolute w-44 h-44 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white shadow-xl shadow-blue-500/30 flex flex-col items-center justify-center transition-all duration-100 select-none ${
              isPressing
                ? 'scale-95 shadow-md shadow-blue-600/40'
                : 'hover:scale-[1.02] active:scale-95'
            }`}
          >
            <span className="text-2xl font-black tracking-wide drop-shadow-xs">سبّح</span>
            <span className="text-[11px] text-blue-100 mt-1 opacity-80">انقر للتسبيح</span>
          </button>
        </div>

        {/* Lifetime count */}
        <div className="text-xs text-[#64748B] dark:text-slate-400 font-semibold flex items-center gap-1.5 mt-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>مجموع التسبيحات الكلي: {state.totalLifetime}</span>
        </div>
      </AppCard>

      {/* Dhikr Selector Grid */}
      <AppCard>
        <h3 className="text-sm font-bold text-[#172033] dark:text-white mb-2.5">
          اختر ذكراً للتسبيح
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TASBEEH_PRESETS.map((d) => (
            <button
              key={d}
              onClick={() => handleSelectDhikr(d)}
              className={`p-3 rounded-xl text-xs font-bold text-right border transition-all flex items-center justify-between ${
                state.dhikrText === d
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-400'
                  : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-[#172033] dark:text-slate-300 hover:border-blue-200'
              }`}
            >
              <span>{d}</span>
              {state.dhikrText === d && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
            </button>
          ))}
        </div>
      </AppCard>
    </div>
  );
};
