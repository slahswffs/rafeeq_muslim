import React from 'react';
import { AppCard } from '../common/AppCard';
import { DayPrayerRecord, PrayerId } from '../../types';
import { X, Check, Calendar, TrendingUp } from 'lucide-react';

interface PrayerHistoryModalProps {
  records: Record<string, DayPrayerRecord>;
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  onTogglePrayerForDate: (prayerId: PrayerId, dateStr: string) => void;
  onClose: () => void;
}

export const PrayerHistoryModal: React.FC<PrayerHistoryModalProps> = ({
  records,
  selectedDateStr,
  onSelectDate,
  onTogglePrayerForDate,
  onClose,
}) => {
  // Generate past 14 days
  const pastDays: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yr = d.getFullYear();
    const mo = (d.getMonth() + 1).toString().padStart(2, '0');
    const dy = d.getDate().toString().padStart(2, '0');
    pastDays.push(`${yr}-${mo}-${dy}`);
  }

  const selectedRecord: DayPrayerRecord = records[selectedDateStr] || {
    date: selectedDateStr,
    prayers: { fajr: false, sunrise: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    completedCount: 0,
  };

  const primaryPrayers: Array<{ id: PrayerId; name: string }> = [
    { id: 'fajr', name: 'الفجر' },
    { id: 'dhuhr', name: 'الظهر' },
    { id: 'asr', name: 'العصر' },
    { id: 'maghrib', name: 'المغرب' },
    { id: 'isha', name: 'العشاء' },
  ];

  const percentage = Math.round((selectedRecord.completedCount / 5) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#F5F7FB] dark:bg-[#0F172A] w-full max-w-lg rounded-[28px] border border-[#DCE3EF] dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-[#172033] border-b border-[#DCE3EF] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-[#172033] dark:text-white">
              سجل الصلوات السابق
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Days Selector */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {pastDays.map((dateStr, idx) => {
              const rec = records[dateStr];
              const count = rec ? rec.completedCount : 0;
              const isSelected = dateStr === selectedDateStr;
              const label = idx === 0 ? 'اليوم' : idx === 1 ? 'أمس' : dateStr.slice(5);

              return (
                <button
                  key={dateStr}
                  onClick={() => onSelectDate(dateStr)}
                  className={`flex flex-col items-center min-w-[64px] p-2 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 text-[#172033] dark:text-slate-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-[11px] font-bold">{label}</span>
                  <span
                    className={`text-xs mt-1 font-semibold ${
                      isSelected ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {count}/5
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Day Details Card */}
          <AppCard>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-[#64748B] dark:text-slate-400 font-medium">
                  تفاصيل صلوات يوم
                </span>
                <h3 className="text-sm font-bold text-[#172033] dark:text-white">
                  {selectedDateStr}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>النسبة: {percentage}%</span>
              </div>
            </div>

            <div className="space-y-2">
              {primaryPrayers.map((prayer) => {
                const isDone = !!selectedRecord.prayers[prayer.id];

                return (
                  <div
                    key={prayer.id}
                    onClick={() => onTogglePrayerForDate(prayer.id, selectedDateStr)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                      </div>
                      <span className="text-sm font-bold text-[#172033] dark:text-white">
                        {prayer.name}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-semibold ${
                        isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {isDone ? 'مسجلة ✓' : 'غير مسجلة'}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-center text-[#64748B] dark:text-slate-400 mt-3">
              يمكنك النقر على أي صلاة لتعديل حالتها في السجل بأثر رجعي
            </p>
          </AppCard>
        </div>
      </div>
    </div>
  );
};
