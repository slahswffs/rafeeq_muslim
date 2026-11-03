import { AppSettings, DayPrayerRecord, PrayerId, QuranReadingPosition, Achievement } from '../types';
import { DEFAULT_SETTINGS, INITIAL_ACHIEVEMENTS } from '../constants';

const KEYS = {
  SETTINGS: 'rafiq_settings_v1',
  PRAYER_HISTORY: 'rafiq_prayers_v1',
  QURAN_LAST_READ: 'rafiq_quran_last_read_v1',
  QURAN_BOOKMARKS: 'rafiq_quran_bookmarks_v1',
  ADHKAR_PROGRESS: 'rafiq_adhkar_progress_v1',
  TASBEEH: 'rafiq_tasbeeh_v1',
  DAILY_CHECKLIST: 'rafiq_daily_checklist_v1',
  ACHIEVEMENTS: 'rafiq_achievements_v1',
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const storageService = {
  // SETTINGS
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Error reading settings', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings', e);
    }
  },

  // PRAYERS HISTORY
  getAllPrayerRecords(): Record<string, DayPrayerRecord> {
    try {
      const stored = localStorage.getItem(KEYS.PRAYER_HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading prayer history', e);
    }
    return {};
  },

  getDayPrayerRecord(dateStr: string = getTodayKey()): DayPrayerRecord {
    const all = this.getAllPrayerRecords();
    if (all[dateStr]) {
      return all[dateStr];
    }
    return {
      date: dateStr,
      prayers: {
        fajr: false,
        sunrise: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      },
      completedCount: 0,
    };
  },

  togglePrayer(prayerId: PrayerId, dateStr: string = getTodayKey()): DayPrayerRecord {
    const all = this.getAllPrayerRecords();
    const current = this.getDayPrayerRecord(dateStr);

    const newState = !current.prayers[prayerId];
    current.prayers[prayerId] = newState;

    // Recalculate completed count (5 primary prayers, excluding sunrise)
    const primaryPrayers: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    current.completedCount = primaryPrayers.filter((p) => current.prayers[p]).length;

    all[dateStr] = current;
    try {
      localStorage.setItem(KEYS.PRAYER_HISTORY, JSON.stringify(all));
    } catch (e) {
      console.error('Error saving prayer state', e);
    }

    return current;
  },

  // QURAN LAST READ
  getLastReadPosition(): QuranReadingPosition {
    try {
      const stored = localStorage.getItem(KEYS.QURAN_LAST_READ);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading last read Quran', e);
    }
    return {
      surahNumber: 2,
      surahName: 'البقرة',
      ayahNumber: 255, // آية الكرسي
      juz: 3,
      page: 42,
      updatedAt: new Date().toISOString(),
    };
  },

  saveLastReadPosition(pos: QuranReadingPosition): void {
    try {
      localStorage.setItem(KEYS.QURAN_LAST_READ, JSON.stringify(pos));
    } catch (e) {
      console.error('Error saving last read Quran', e);
    }
  },

  // QURAN BOOKMARKS
  getBookmarks(): Array<{ surahNumber: number; ayahNumber: number; surahName: string; textPreview: string }> {
    try {
      const stored = localStorage.getItem(KEYS.QURAN_BOOKMARKS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading bookmarks', e);
    }
    return [
      { surahNumber: 1, ayahNumber: 1, surahName: 'الفاتحة', textPreview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
      { surahNumber: 2, ayahNumber: 255, surahName: 'البقرة', textPreview: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...' },
    ];
  },

  toggleBookmark(item: { surahNumber: number; ayahNumber: number; surahName: string; textPreview: string }): boolean {
    const list = this.getBookmarks();
    const index = list.findIndex((b) => b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber);
    let bookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      bookmarked = false;
    } else {
      list.unshift(item);
      bookmarked = true;
    }
    try {
      localStorage.setItem(KEYS.QURAN_BOOKMARKS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving bookmark', e);
    }
    return bookmarked;
  },

  // ADHKAR PROGRESS
  getAdhkarProgress(dateStr: string = getTodayKey()): Record<string, number> {
    try {
      const stored = localStorage.getItem(`${KEYS.ADHKAR_PROGRESS}_${dateStr}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading adhkar progress', e);
    }
    return {};
  },

  saveAdhkarItemCount(itemId: string, count: number, dateStr: string = getTodayKey()): void {
    const progress = this.getAdhkarProgress(dateStr);
    progress[itemId] = count;
    try {
      localStorage.setItem(`${KEYS.ADHKAR_PROGRESS}_${dateStr}`, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving adhkar progress', e);
    }
  },

  // TASBEEH
  getTasbeehState(): { currentCount: number; target: number; dhikrText: string; totalLifetime: number } {
    try {
      const stored = localStorage.getItem(KEYS.TASBEEH);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading tasbeeh', e);
    }
    return {
      currentCount: 0,
      target: 33,
      dhikrText: 'سبحان الله وبحمده',
      totalLifetime: 0,
    };
  },

  saveTasbeehState(state: { currentCount: number; target: number; dhikrText: string; totalLifetime: number }): void {
    try {
      localStorage.setItem(KEYS.TASBEEH, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving tasbeeh', e);
    }
  },

  // DAILY CHALLENGE / CHECKLIST
  getDailyChecklist(dateStr: string = getTodayKey()): {
    quranRead: boolean;
    adhkarMorningDone: boolean;
    adhkarEveningDone: boolean;
    tasbeehGoalDone: boolean;
    sadaqahDone: boolean;
    extraDuaDone: boolean;
  } {
    try {
      const stored = localStorage.getItem(`${KEYS.DAILY_CHECKLIST}_${dateStr}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading daily checklist', e);
    }
    return {
      quranRead: false,
      adhkarMorningDone: false,
      adhkarEveningDone: false,
      tasbeehGoalDone: false,
      sadaqahDone: false,
      extraDuaDone: false,
    };
  },

  saveDailyChecklist(
    checklist: {
      quranRead: boolean;
      adhkarMorningDone: boolean;
      adhkarEveningDone: boolean;
      tasbeehGoalDone: boolean;
      sadaqahDone: boolean;
      extraDuaDone: boolean;
    },
    dateStr: string = getTodayKey()
  ): void {
    try {
      localStorage.setItem(`${KEYS.DAILY_CHECKLIST}_${dateStr}`, JSON.stringify(checklist));
    } catch (e) {
      console.error('Error saving daily checklist', e);
    }
  },

  // ACHIEVEMENTS
  getAchievements(): Achievement[] {
    try {
      const stored = localStorage.getItem(KEYS.ACHIEVEMENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading achievements', e);
    }
    return INITIAL_ACHIEVEMENTS;
  },

  updateAchievement(id: string, progressDelta: number = 1): { newlyUnlocked: boolean; achievement: Achievement | null } {
    const list = this.getAchievements();
    const item = list.find((a) => a.id === id);
    if (!item) return { newlyUnlocked: false, achievement: null };

    let newlyUnlocked = false;
    item.progress = Math.min(item.progress + progressDelta, item.maxProgress);
    if (!item.unlocked && item.progress >= item.maxProgress) {
      item.unlocked = true;
      item.unlockedAt = new Date().toISOString();
      newlyUnlocked = true;
    }

    try {
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving achievements', e);
    }

    return { newlyUnlocked, achievement: item };
  },

  // Reset all user data
  clearAllData(): void {
    try {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error('Error clearing data', e);
    }
  },
};
