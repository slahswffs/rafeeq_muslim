import { PrayerId, PrayerTimeItem, CalcMethod, AsrMethod } from '../types';

// Kaaba Coordinates
export const KAABA_LAT = 21.422487;
export const KAABA_LNG = 39.826206;

export interface CalculationParams {
  fajrAngle: number;
  ishaAngle?: number;
  ishaIntervalMinutes?: number;
}

const METHOD_PARAMS: Record<CalcMethod, CalculationParams> = {
  MWL: { fajrAngle: 18, ishaAngle: 17 },
  ISNA: { fajrAngle: 15, ishaAngle: 15 },
  Egypt: { fajrAngle: 19.5, ishaAngle: 17.5 },
  Makkah: { fajrAngle: 18.5, ishaIntervalMinutes: 90 },
  Karachi: { fajrAngle: 18, ishaAngle: 18 },
  Tehran: { fajrAngle: 17.7, ishaAngle: 14 },
  Dubai: { fajrAngle: 18.2, ishaAngle: 18.2 },
};

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function fixAngle(angle: number): number {
  let a = angle - 360 * Math.floor(angle / 360);
  return a < 0 ? a + 360 : a;
}

function fixHour(hour: number): number {
  let h = hour - 24 * Math.floor(hour / 24);
  return h < 0 ? h + 24 : h;
}

// Compute Julian Date from standard Date object
function getJulianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Sun position equations
function getSunCoordinates(julianDate: number) {
  const d = julianDate - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.02 * Math.sin(degToRad(2 * g)));

  const e = 23.439 - 0.00000036 * d;
  const sinL = Math.sin(degToRad(L));
  const cosL = Math.cos(degToRad(L));

  const ra = fixHour(radToDeg(Math.atan2(Math.cos(degToRad(e)) * sinL, cosL)) / 15);
  const declination = radToDeg(Math.asin(Math.sin(degToRad(e)) * sinL));
  const equationOfTime = q / 15 - ra;

  return { declination, equationOfTime };
}

// Compute prayer time in decimal hours
function computeTime(angle: number, isMorning: boolean, lat: number, declination: number, noon: number): number {
  const cosH = (-Math.sin(degToRad(angle)) - Math.sin(degToRad(lat)) * Math.sin(degToRad(declination))) /
    (Math.cos(degToRad(lat)) * Math.cos(degToRad(declination)));

  if (cosH > 1) return isMorning ? noon - 1.5 : noon + 1.5;
  if (cosH < -1) return isMorning ? noon - 1.5 : noon + 1.5;

  const H = radToDeg(Math.acos(cosH)) / 15;
  return isMorning ? noon - H : noon + H;
}

// Compute Asr angle
function computeAsrTime(shadowFactor: number, lat: number, declination: number, noon: number): number {
  const angle = -radToDeg(Math.atan(1 / (shadowFactor + Math.tan(degToRad(Math.abs(lat - declination))))));
  return computeTime(-angle, false, lat, declination, noon);
}

function decimalToTime(decimalHours: number, date: Date): { timeString: string; timestamp: number } {
  if (isNaN(decimalHours) || !isFinite(decimalHours)) {
    decimalHours = 12;
  }
  let hours = Math.floor(decimalHours);
  let minutes = Math.floor((decimalHours - hours) * 60);
  let seconds = Math.floor(((decimalHours - hours) * 60 - minutes) * 60);

  if (hours >= 24) hours %= 24;
  if (hours < 0) hours = (hours + 24) % 24;

  const targetDate = new Date(date);
  targetDate.setHours(hours, minutes, seconds, 0);

  // Format 12-hour with Arabic suffix
  const period = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

  return {
    timeString,
    timestamp: targetDate.getTime(),
  };
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  calcMethod: CalcMethod = 'Makkah',
  asrMethod: AsrMethod = 'Standard'
): PrayerTimeItem[] {
  const jd = getJulianDate(date);
  const { declination, equationOfTime } = getSunCoordinates(jd);

  // Timezone in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  // Midday (Dhuhr)
  const dhuhrDecimal = fixHour(12 + timezoneOffset - lng / 15 - equationOfTime);

  const params = METHOD_PARAMS[calcMethod] || METHOD_PARAMS.Makkah;

  // Fajr
  const fajrDecimal = computeTime(params.fajrAngle, true, lat, declination, dhuhrDecimal);
  // Sunrise (zenith 0.833°)
  const sunriseDecimal = computeTime(0.833, true, lat, declination, dhuhrDecimal);
  // Sunset / Maghrib (zenith 0.833°)
  const sunsetDecimal = computeTime(0.833, false, lat, declination, dhuhrDecimal);

  // Asr
  const shadowFactor = asrMethod === 'Hanafi' ? 2 : 1;
  const asrDecimal = computeAsrTime(shadowFactor, lat, declination, dhuhrDecimal);

  // Isha
  let ishaDecimal: number;
  if (params.ishaIntervalMinutes) {
    ishaDecimal = sunsetDecimal + params.ishaIntervalMinutes / 60;
  } else {
    ishaDecimal = computeTime(params.ishaAngle || 17, false, lat, declination, dhuhrDecimal);
  }

  const fajr = decimalToTime(fajrDecimal, date);
  const sunrise = decimalToTime(sunriseDecimal, date);
  const dhuhr = decimalToTime(dhuhrDecimal, date);
  const asr = decimalToTime(asrDecimal, date);
  const maghrib = decimalToTime(sunsetDecimal, date);
  const isha = decimalToTime(ishaDecimal, date);

  return [
    { id: 'fajr', nameArabic: 'الفجر', timeString: fajr.timeString, timestamp: fajr.timestamp },
    { id: 'sunrise', nameArabic: 'الشروق', timeString: sunrise.timeString, timestamp: sunrise.timestamp },
    { id: 'dhuhr', nameArabic: 'الظهر', timeString: dhuhr.timeString, timestamp: dhuhr.timestamp },
    { id: 'asr', nameArabic: 'العصر', timeString: asr.timeString, timestamp: asr.timestamp },
    { id: 'maghrib', nameArabic: 'المغرب', timeString: maghrib.timeString, timestamp: maghrib.timestamp },
    { id: 'isha', nameArabic: 'العشاء', timeString: isha.timeString, timestamp: isha.timestamp },
  ];
}

export function getNextPrayer(prayers: PrayerTimeItem[], now: Date = new Date()): {
  nextPrayer: PrayerTimeItem;
  remainingMs: number;
  remainingFormatted: string;
} {
  const nowMs = now.getTime();
  // Filter only actual prayers (excluding sunrise usually or include if desired)
  const sorted = prayers.filter((p) => p.id !== 'sunrise');
  
  for (const prayer of sorted) {
    if (prayer.timestamp > nowMs) {
      const diff = prayer.timestamp - nowMs;
      return {
        nextPrayer: prayer,
        remainingMs: diff,
        remainingFormatted: formatDuration(diff),
      };
    }
  }

  // If all prayers passed today, next is Fajr tomorrow
  const firstPrayer = sorted[0];
  const fajrTomorrowTime = firstPrayer.timestamp + 24 * 60 * 60 * 1000;
  const diff = fajrTomorrowTime - nowMs;
  return {
    nextPrayer: firstPrayer,
    remainingMs: diff,
    remainingFormatted: formatDuration(diff),
  };
}

export function formatDuration(ms: number): string {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateQiblaDirection(userLat: number, userLng: number): number {
  const phiK = degToRad(KAABA_LAT);
  const lambdaK = degToRad(KAABA_LNG);
  const phi = degToRad(userLat);
  const lambda = degToRad(userLng);

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

  let qibla = radToDeg(Math.atan2(y, x));
  return (qibla + 360) % 360;
}
