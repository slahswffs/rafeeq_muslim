import React, { useState, useEffect } from 'react';
import { AppCard } from '../common/AppCard';
import { calculateQiblaDirection, KAABA_LAT, KAABA_LNG } from '../../services/prayerService';
import { AppSettings } from '../../types';
import { Compass, MapPin, Navigation, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface QiblaScreenProps {
  settings: AppSettings;
  onBack?: () => void;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ settings, onBack }) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);

  // Qibla angle relative to true North for user location
  const qiblaAngle = Math.round(calculateQiblaDirection(settings.latitude, settings.longitude));

  // Compute distance to Makkah using Haversine formula
  const getDistanceToKaaba = () => {
    const R = 6371; // km
    const dLat = ((KAABA_LAT - settings.latitude) * Math.PI) / 180;
    const dLon = ((KAABA_LNG - settings.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((settings.latitude * Math.PI) / 180) *
        Math.cos((KAABA_LAT * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;
      // WebKit compass heading for iOS
      if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
        heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard Android deviceorientation
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null) {
        setHasCompassSensor(true);
        setDeviceHeading(Math.round(heading));
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setHasCompassSensor(false);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const activeHeading = hasCompassSensor ? deviceHeading : manualHeading;
  const needleRotation = (qiblaAngle - activeHeading + 360) % 360;
  const isAligned = Math.abs(needleRotation) < 5 || Math.abs(needleRotation - 360) < 5;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-slate-400 hover:text-blue-600 p-2 rounded-xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 transition-colors shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
      )}

      {/* Hero Location & Angle Info */}
      <div className="p-5 rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-200" />
            <span className="text-sm font-bold">{settings.city}</span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-semibold">
            {getDistanceToKaaba()} كم إلى مكة
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-blue-200 block">زاوية القبلة من الشمال</span>
            <span className="text-3xl font-black font-mono">{qiblaAngle}°</span>
          </div>

          {isAligned ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>أنت تواجه القبلة الآن</span>
            </div>
          ) : (
            <div className="text-left">
              <span className="text-xs text-blue-200 block">الاتجاه التقريبي</span>
              <span className="text-sm font-bold">
                {qiblaAngle < 90
                  ? 'شمال شرق'
                  : qiblaAngle < 180
                  ? 'جنوب شرق'
                  : qiblaAngle < 270
                  ? 'جنوب غرب'
                  : 'شمال غرب'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Compass Interactive Dial */}
      <AppCard className="flex flex-col items-center justify-center py-8 relative">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Dial Disk */}
          <div
            style={{ transform: `rotate(${-activeHeading}deg)` }}
            className="w-full h-full rounded-full border-4 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 relative flex items-center justify-center transition-transform duration-300 shadow-inner"
          >
            {/* Cardinal Markers */}
            <span className="absolute top-2 font-black text-xs text-rose-600">ش (N)</span>
            <span className="absolute bottom-2 font-bold text-xs text-slate-500">ج (S)</span>
            <span className="absolute right-2 font-bold text-xs text-slate-500">ق (E)</span>
            <span className="absolute left-2 font-bold text-xs text-slate-500">غ (W)</span>

            {/* Dial degree ticks */}
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 dark:border-slate-700" />
          </div>

          {/* Kaaba Direction Indicator Needle */}
          <div
            style={{ transform: `rotate(${needleRotation}deg)` }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300"
          >
            {/* Pointer to Kaaba */}
            <div className="flex flex-col items-center -translate-y-8">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 text-xs font-bold border-2 border-white">
                🕋
              </div>
              <div className="w-1.5 h-12 bg-gradient-to-t from-transparent via-amber-500 to-amber-600 rounded-full" />
            </div>
            {/* Center Pivot */}
            <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-md z-10" />
          </div>
        </div>

        {/* Alignment Guidance */}
        <p className="text-xs text-[#64748B] dark:text-slate-400 mt-6 text-center max-w-xs font-medium">
          وجّه الهاتف أفقيًا بحيث يتطابق رمز الكعبة المشرفة 🕋 مع السهم العلوي
        </p>

        {/* Manual adjustment slider for testing or devices without compass sensor */}
        <div className="w-full max-w-xs mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400 mb-1.5">
            <span>محاكاة دوران الهاتف:</span>
            <span className="font-mono font-bold">{activeHeading}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={activeHeading}
            onChange={(e) => {
              setHasCompassSensor(false);
              setManualHeading(parseInt(e.target.value, 10));
            }}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </AppCard>

      {/* Sensor Availability Note */}
      <AppCard className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-xs leading-relaxed text-[#172033] dark:text-slate-200">
            {hasCompassSensor ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                ✓ مستشعر البوصلة الجغرافي نشط ويعمل بدقة.
              </span>
            ) : (
              <span>
                إذا لم تكن البوصلة تدور تلقائياً، يرجى تفعيل إذن مستشعرات الحركة (Sensors) أو استخدام مؤشر الزاوية المعروض أعلاه ({qiblaAngle}°).
              </span>
            )}
          </div>
        </div>
      </AppCard>
    </div>
  );
};
