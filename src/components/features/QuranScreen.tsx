import React, { useState } from 'react';
import { AppCard } from '../common/AppCard';
import { SURAHS_LIST, getSurahAyahs } from '../../data/quranData';
import { SurahMeta, QuranReadingPosition, Ayah, FontSize } from '../../types';
import { storageService } from '../../services/storageService';
import { audioService } from '../../services/audioService';
import {
  Search,
  BookOpen,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  X,
  Type,
  ArrowRight,
} from 'lucide-react';

interface QuranScreenProps {
  lastRead: QuranReadingPosition;
  onUpdateLastRead: (pos: QuranReadingPosition) => void;
}

export const QuranScreen: React.FC<QuranScreenProps> = ({
  lastRead,
  onUpdateLastRead,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan' | 'bookmarks'>('all');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [copiedAyahNumber, setCopiedAyahNumber] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState(storageService.getBookmarks());

  // Normalize Arabic text for robust search (remove diacritics, normalize alef/ta-marbuta)
  const normalizeArabic = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/[\u064B-\u065F]/g, '');
  };

  // Filter surahs
  const filteredSurahs = SURAHS_LIST.filter((s) => {
    const normQuery = normalizeArabic(searchQuery);
    const normName = normalizeArabic(s.name);
    const withoutAl = normName.startsWith('ال') ? normName.slice(2) : normName;

    const matchesSearch =
      normName.includes(normQuery) ||
      withoutAl.includes(normQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      s.number.toString() === searchQuery.trim();

    if (!matchesSearch) return false;
    if (filterType === 'Meccan') return s.revelationType === 'Meccan';
    if (filterType === 'Medinan') return s.revelationType === 'Medinan';
    if (filterType === 'bookmarks') {
      return bookmarks.some((b) => b.surahNumber === s.number);
    }
    return true;
  });

  const handleOpenSurah = (surah: SurahMeta, targetAyah: number = 1) => {
    setSelectedSurah(surah);
    onUpdateLastRead({
      surahNumber: surah.number,
      surahName: surah.name,
      ayahNumber: targetAyah,
      juz: surah.juz,
      page: surah.startPage,
      updatedAt: new Date().toISOString(),
    });
    audioService.vibrate(15);
  };

  const handleToggleBookmark = (ayah: Ayah, surah: SurahMeta) => {
    const isBookmarked = storageService.toggleBookmark({
      surahNumber: surah.number,
      ayahNumber: ayah.numberInSurah,
      surahName: surah.name,
      textPreview: ayah.text.slice(0, 60),
    });
    setBookmarks(storageService.getBookmarks());
    audioService.vibrate(25);
    if (isBookmarked) {
      audioService.playCompletionSound();
    }
  };

  const handleCopyAyah = (ayah: Ayah, surah: SurahMeta) => {
    const textToCopy = `﴿${ayah.text}﴾ [سورة ${surah.name} : ${ayah.numberInSurah}]`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedAyahNumber(ayah.numberInSurah);
      setTimeout(() => setCopiedAyahNumber(null), 2000);
      audioService.vibrate(20);
    }
  };

  const handleShareAyah = (ayah: Ayah, surah: SurahMeta) => {
    const textToShare = `﴿${ayah.text}﴾ [سورة ${surah.name} : ${ayah.numberInSurah}]\n— تطبيق رفيق المسلم`;
    if (navigator.share) {
      navigator.share({
        title: `سورة ${surah.name}`,
        text: textToShare,
      }).catch(() => {});
    } else {
      handleCopyAyah(ayah, surah);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-lg leading-loose';
      case 'medium':
        return 'text-2xl leading-[2.4]';
      case 'large':
        return 'text-3xl leading-[2.6]';
      case 'xlarge':
        return 'text-4xl leading-[2.8]';
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Search and Filters Header */}
      {!selectedSurah && (
        <>
          {/* Last Read Quick Resume Banner */}
          <div
            onClick={() => {
              const target = SURAHS_LIST.find((s) => s.number === lastRead.surahNumber);
              if (target) handleOpenSurah(target, lastRead.ayahNumber);
            }}
            className="p-4 rounded-[22px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md shadow-blue-500/20 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] text-blue-200 block font-medium">
                  تابع من حيث توقفت
                </span>
                <span className="text-base font-bold">
                  سورة {lastRead.surahName} · الآية {lastRead.ayahNumber}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/20">
              <span>متابعة</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن اسم السورة أو رقمها..."
              className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 text-sm focus:outline-none focus:border-blue-500 shadow-2xs placeholder-[#64748B] dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 text-[#64748B] dark:text-slate-300'
              }`}
            >
              جميع السور (114)
            </button>
            <button
              onClick={() => setFilterType('Meccan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'Meccan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 text-[#64748B] dark:text-slate-300'
              }`}
            >
              مكية
            </button>
            <button
              onClick={() => setFilterType('Medinan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'Medinan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 text-[#64748B] dark:text-slate-300'
              }`}
            >
              مدنية
            </button>
            <button
              onClick={() => setFilterType('bookmarks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'bookmarks'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#172033] border border-[#DCE3EF] dark:border-slate-800 text-[#64748B] dark:text-slate-300'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>المفضلة ({bookmarks.length})</span>
            </button>
          </div>

          {/* Surahs List */}
          <div className="space-y-2">
            {filteredSurahs.map((surah) => {
              const isLastReadSurah = surah.number === lastRead.surahNumber;

              return (
                <div
                  key={surah.number}
                  onClick={() => handleOpenSurah(surah)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer active:scale-[0.99] ${
                    isLastReadSurah
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-[#172033] border-[#DCE3EF] dark:border-slate-800 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Surah Number Badge */}
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-400 font-mono">
                      {surah.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#172033] dark:text-white">
                          سورة {surah.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400">
                          {surah.revelationTypeArabic}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] dark:text-slate-400">
                        {surah.englishName} · {surah.numberOfAyahs} آية
                      </span>
                    </div>
                  </div>

                  <div className="text-left flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">
                      الجزء {surah.juz}
                    </span>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Surah Reader Full View */}
      {selectedSurah && (
        <div className="animate-in fade-in zoom-in-98 duration-150 space-y-4">
          {/* Reader Top Bar */}
          <div className="flex items-center justify-between sticky top-16 z-20 bg-[#F5F7FB]/95 dark:bg-[#0F172A]/95 backdrop-blur-md p-2 rounded-2xl border border-[#DCE3EF] dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setSelectedSurah(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#172033] dark:text-slate-200 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>قائمة السور</span>
            </button>

            <div className="text-center">
              <h2 className="text-sm font-bold text-[#172033] dark:text-white">
                سورة {selectedSurah.name}
              </h2>
              <span className="text-[10px] text-[#64748B] dark:text-slate-400">
                {selectedSurah.revelationTypeArabic} · {selectedSurah.numberOfAyahs} آية
              </span>
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
                className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-[#172033] dark:text-slate-200"
              >
                <option value="small">صغير</option>
                <option value="medium">متوسط</option>
                <option value="large">كبير</option>
                <option value="xlarge">كبير جداً</option>
              </select>
            </div>
          </div>

          {/* Bismillah Header (except for Surah At-Tawbah 9) */}
          {selectedSurah.number !== 9 && (
            <div className="text-center py-6 bg-white dark:bg-[#172033] rounded-[24px] border border-[#DCE3EF] dark:border-slate-800 shadow-xs">
              <span className="font-quran text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-200">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          )}

          {/* Ayahs Display */}
          <div className="space-y-3">
            {getSurahAyahs(selectedSurah.number).map((ayah) => {
              const isAyahBookmarked = bookmarks.some(
                (b) => b.surahNumber === selectedSurah.number && b.ayahNumber === ayah.numberInSurah
              );

              return (
                <AppCard key={ayah.numberInSurah} className="relative group">
                  {/* Ayah Text in Amiri Quran Font */}
                  <div className="text-right py-2 px-1">
                    <p className={`font-quran ${getFontSizeClass()} text-[#172033] dark:text-slate-100 font-normal leading-loose`}>
                      {ayah.text}{' '}
                      <span className="inline-flex items-center justify-center w-7 h-7 mx-1 rounded-full border border-blue-400 text-blue-600 dark:text-blue-400 font-bold text-xs select-none">
                        {ayah.numberInSurah}
                      </span>
                    </p>
                  </div>

                  {/* Ayah Actions: Bookmark, Copy, Share */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400">
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <span>آية {ayah.numberInSurah}</span>
                      <span>·</span>
                      <span>صفحة {ayah.page}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleBookmark(ayah, selectedSurah)}
                        title="حفظ في المفضلة"
                        className={`p-1.5 rounded-xl border transition-colors ${
                          isAyahBookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleCopyAyah(ayah, selectedSurah)}
                        title="نسخ الآية"
                        className="p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {copiedAyahNumber === ayah.numberInSurah ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleShareAyah(ayah, selectedSurah)}
                        title="مشاركة الآية"
                        className="p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </AppCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
