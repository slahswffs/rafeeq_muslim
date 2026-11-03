export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeItem {
  id: PrayerId;
  nameArabic: string;
  timeString: string;
  timestamp: number; // millisecond timestamp of prayer today
  isCompleted?: boolean;
}

export interface DayPrayerRecord {
  date: string; // YYYY-MM-DD
  prayers: Record<PrayerId, boolean>;
  completedCount: number; // 0-5 (excluding sunrise)
  notes?: string;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeArabic: string;
  startPage: number;
  juz: number;
}

export interface Ayah {
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
}

export interface QuranReadingPosition {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  juz: number;
  page: number;
  updatedAt: string;
}

export interface DhikrItem {
  id: string;
  text: string;
  translation?: string;
  count: number; // target count (e.g. 1, 3, 33, 100)
  currentCount: number;
  fadl?: string; // virtue
  reference?: string;
  isCompleted?: boolean;
}

export interface DhikrCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  items: DhikrItem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type CalcMethod = 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran' | 'Dubai';
export type AsrMethod = 'Standard' | 'Hanafi';
export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface AppSettings {
  themeMode: ThemeMode;
  fontSize: FontSize;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  calcMethod: CalcMethod;
  asrMethod: AsrMethod;
  notificationsEnabled: Record<PrayerId, boolean>;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // HH:mm
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  onboardingCompleted: boolean;
  hijriDayAdjustment: number; // e.g. -1, 0, +1
}

export interface CityPreset {
  nameAr: string;
  countryAr: string;
  lat: number;
  lng: number;
  timezoneOffset: number; // hours
}
