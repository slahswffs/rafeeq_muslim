import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/quran_model.dart';

class QuranData {
  // Metadata for all 114 Surahs
  static const List<SurahModel> allSurahs = [
    SurahModel(number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', totalVerses: 7, revelationType: 'مكية', startPage: 1, juz: 1),
    SurahModel(number: 2, name: 'البقرة', englishName: 'Al-Baqarah', totalVerses: 286, revelationType: 'مدنية', startPage: 2, juz: 1),
    SurahModel(number: 3, name: 'آل عمران', englishName: 'Ali \'Imran', totalVerses: 200, revelationType: 'مدنية', startPage: 50, juz: 3),
    SurahModel(number: 4, name: 'النساء', englishName: 'An-Nisa', totalVerses: 176, revelationType: 'مدنية', startPage: 77, juz: 4),
    SurahModel(number: 5, name: 'المائدة', englishName: 'Al-Ma\'idah', totalVerses: 120, revelationType: 'مدنية', startPage: 106, juz: 6),
    SurahModel(number: 6, name: 'الأنعام', englishName: 'Al-An\'am', totalVerses: 165, revelationType: 'مكية', startPage: 128, juz: 7),
    SurahModel(number: 7, name: 'الأعراف', englishName: 'Al-A\'raf', totalVerses: 206, revelationType: 'مكية', startPage: 151, juz: 8),
    SurahModel(number: 8, name: 'الأنفال', englishName: 'Al-Anfal', totalVerses: 75, revelationType: 'مدنية', startPage: 177, juz: 9),
    SurahModel(number: 9, name: 'التوبة', englishName: 'At-Tawbah', totalVerses: 129, revelationType: 'مدنية', startPage: 187, juz: 10),
    SurahModel(number: 10, name: 'يونس', englishName: 'Yunus', totalVerses: 109, revelationType: 'مكية', startPage: 208, juz: 11),
    SurahModel(number: 11, name: 'هود', englishName: 'Hud', totalVerses: 123, revelationType: 'مكية', startPage: 221, juz: 11),
    SurahModel(number: 12, name: 'يوسف', englishName: 'Yusuf', totalVerses: 111, revelationType: 'مكية', startPage: 235, juz: 12),
    SurahModel(number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', totalVerses: 43, revelationType: 'مدنية', startPage: 249, juz: 13),
    SurahModel(number: 14, name: 'إبراهيم', englishName: 'Ibrahim', totalVerses: 52, revelationType: 'مكية', startPage: 255, juz: 13),
    SurahModel(number: 15, name: 'الحجر', englishName: 'Al-Hijr', totalVerses: 99, revelationType: 'مكية', startPage: 262, juz: 14),
    SurahModel(number: 16, name: 'النحل', englishName: 'An-Nahl', totalVerses: 128, revelationType: 'مكية', startPage: 267, juz: 14),
    SurahModel(number: 17, name: 'الإسراء', englishName: 'Al-Isra', totalVerses: 111, revelationType: 'مكية', startPage: 282, juz: 15),
    SurahModel(number: 18, name: 'الكهف', englishName: 'Al-Kahf', totalVerses: 110, revelationType: 'مكية', startPage: 293, juz: 15),
    SurahModel(number: 19, name: 'مريم', englishName: 'Maryam', totalVerses: 98, revelationType: 'مكية', startPage: 305, juz: 16),
    SurahModel(number: 20, name: 'طه', englishName: 'Ta-Ha', totalVerses: 135, revelationType: 'مكية', startPage: 312, juz: 16),
    SurahModel(number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', totalVerses: 112, revelationType: 'مكية', startPage: 322, juz: 17),
    SurahModel(number: 22, name: 'الحج', englishName: 'Al-Hajj', totalVerses: 78, revelationType: 'مدنية', startPage: 332, juz: 17),
    SurahModel(number: 23, name: 'المؤمنون', englishName: 'Al-Mu\'minun', totalVerses: 118, revelationType: 'مكية', startPage: 342, juz: 18),
    SurahModel(number: 24, name: 'النور', englishName: 'An-Nur', totalVerses: 64, revelationType: 'مدنية', startPage: 350, juz: 18),
    SurahModel(number: 25, name: 'الفرقان', englishName: 'Al-Furqan', totalVerses: 77, revelationType: 'مكية', startPage: 359, juz: 18),
    SurahModel(number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'ara', totalVerses: 227, revelationType: 'مكية', startPage: 367, juz: 19),
    SurahModel(number: 27, name: 'النمل', englishName: 'An-Naml', totalVerses: 93, revelationType: 'مكية', startPage: 377, juz: 19),
    SurahModel(number: 28, name: 'القصص', englishName: 'Al-Qasas', totalVerses: 88, revelationType: 'مكية', startPage: 385, juz: 20),
    SurahModel(number: 29, name: 'العنكبوت', englishName: 'Al-\'Ankabut', totalVerses: 69, revelationType: 'مكية', startPage: 396, juz: 20),
    SurahModel(number: 30, name: 'الروم', englishName: 'Ar-Rum', totalVerses: 60, revelationType: 'مكية', startPage: 404, juz: 21),
    SurahModel(number: 31, name: 'لقمان', englishName: 'Luqman', totalVerses: 34, revelationType: 'مكية', startPage: 411, juz: 21),
    SurahModel(number: 32, name: 'السجدة', englishName: 'As-Sajdah', totalVerses: 30, revelationType: 'مكية', startPage: 415, juz: 21),
    SurahModel(number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', totalVerses: 73, revelationType: 'مدنية', startPage: 418, juz: 21),
    SurahModel(number: 34, name: 'سبأ', englishName: 'Saba', totalVerses: 54, revelationType: 'مكية', startPage: 428, juz: 22),
    SurahModel(number: 35, name: 'فاطر', englishName: 'Fatir', totalVerses: 45, revelationType: 'مكية', startPage: 434, juz: 22),
    SurahModel(number: 36, name: 'يس', englishName: 'Ya-Sin', totalVerses: 83, revelationType: 'مكية', startPage: 440, juz: 22),
    SurahModel(number: 37, name: 'الصافات', englishName: 'As-Saffat', totalVerses: 182, revelationType: 'مكية', startPage: 446, juz: 23),
    SurahModel(number: 38, name: 'ص', englishName: 'Sad', totalVerses: 88, revelationType: 'مكية', startPage: 453, juz: 23),
    SurahModel(number: 39, name: 'الزمر', englishName: 'Az-Zumar', totalVerses: 75, revelationType: 'مكية', startPage: 458, juz: 23),
    SurahModel(number: 40, name: 'غافر', englishName: 'Ghafir', totalVerses: 85, revelationType: 'مكية', startPage: 467, juz: 24),
    SurahModel(number: 41, name: 'فصلت', englishName: 'Fussilat', totalVerses: 54, revelationType: 'مكية', startPage: 477, juz: 24),
    SurahModel(number: 42, name: 'الشورى', englishName: 'Ash-Shura', totalVerses: 53, revelationType: 'مكية', startPage: 483, juz: 25),
    SurahModel(number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', totalVerses: 89, revelationType: 'مكية', startPage: 489, juz: 25),
    SurahModel(number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', totalVerses: 59, revelationType: 'مكية', startPage: 496, juz: 25),
    SurahModel(number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', totalVerses: 37, revelationType: 'مكية', startPage: 499, juz: 25),
    SurahModel(number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', totalVerses: 35, revelationType: 'مكية', startPage: 502, juz: 26),
    SurahModel(number: 47, name: 'محمد', englishName: 'Muhammad', totalVerses: 38, revelationType: 'مدنية', startPage: 507, juz: 26),
    SurahModel(number: 48, name: 'الفتح', englishName: 'Al-Fath', totalVerses: 29, revelationType: 'مدنية', startPage: 511, juz: 26),
    SurahModel(number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', totalVerses: 18, revelationType: 'مدنية', startPage: 515, juz: 26),
    SurahModel(number: 50, name: 'ق', englishName: 'Qaf', totalVerses: 45, revelationType: 'مكية', startPage: 518, juz: 26),
    SurahModel(number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', totalVerses: 60, revelationType: 'مكية', startPage: 520, juz: 26),
    SurahModel(number: 52, name: 'الطور', englishName: 'At-Tur', totalVerses: 49, revelationType: 'مكية', startPage: 523, juz: 27),
    SurahModel(number: 53, name: 'النجم', englishName: 'An-Najm', totalVerses: 62, revelationType: 'مكية', startPage: 526, juz: 27),
    SurahModel(number: 54, name: 'القمر', englishName: 'Al-Qamar', totalVerses: 55, revelationType: 'مكية', startPage: 528, juz: 27),
    SurahModel(number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', totalVerses: 78, revelationType: 'مدنية', startPage: 531, juz: 27),
    SurahModel(number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', totalVerses: 96, revelationType: 'مكية', startPage: 534, juz: 27),
    SurahModel(number: 57, name: 'الحديد', englishName: 'Al-Hadid', totalVerses: 29, revelationType: 'مدنية', startPage: 537, juz: 27),
    SurahModel(number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', totalVerses: 22, revelationType: 'مدنية', startPage: 542, juz: 28),
    SurahModel(number: 59, name: 'الحشر', englishName: 'Al-Hashr', totalVerses: 24, revelationType: 'مدنية', startPage: 545, juz: 28),
    SurahModel(number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', totalVerses: 13, revelationType: 'مدنية', startPage: 549, juz: 28),
    SurahModel(number: 61, name: 'الصف', englishName: 'As-Saff', totalVerses: 14, revelationType: 'مدنية', startPage: 551, juz: 28),
    SurahModel(number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'ah', totalVerses: 11, revelationType: 'مدنية', startPage: 553, juz: 28),
    SurahModel(number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', totalVerses: 11, revelationType: 'مدنية', startPage: 554, juz: 28),
    SurahModel(number: 64, name: 'التغابن', englishName: 'At-Taghabun', totalVerses: 18, revelationType: 'مدنية', startPage: 556, juz: 28),
    SurahModel(number: 65, name: 'الطلاق', englishName: 'At-Talaq', totalVerses: 12, revelationType: 'مدنية', startPage: 558, juz: 28),
    SurahModel(number: 66, name: 'التحريم', englishName: 'At-Tahrim', totalVerses: 12, revelationType: 'مدنية', startPage: 560, juz: 28),
    SurahModel(number: 67, name: 'الملك', englishName: 'Al-Mulk', totalVerses: 30, revelationType: 'مكية', startPage: 562, juz: 29),
    SurahModel(number: 68, name: 'القلم', englishName: 'Al-Qalam', totalVerses: 52, revelationType: 'مكية', startPage: 564, juz: 29),
    SurahModel(number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', totalVerses: 52, revelationType: 'مكية', startPage: 566, juz: 29),
    SurahModel(number: 70, name: 'المعارج', englishName: 'Al-Ma\'arij', totalVerses: 44, revelationType: 'مكية', startPage: 568, juz: 29),
    SurahModel(number: 71, name: 'نوح', englishName: 'Nuh', totalVerses: 28, revelationType: 'مكية', startPage: 570, juz: 29),
    SurahModel(number: 72, name: 'الجن', englishName: 'Al-Jinn', totalVerses: 28, revelationType: 'مكية', startPage: 572, juz: 29),
    SurahModel(number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', totalVerses: 20, revelationType: 'مكية', startPage: 574, juz: 29),
    SurahModel(number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', totalVerses: 56, revelationType: 'مكية', startPage: 575, juz: 29),
    SurahModel(number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', totalVerses: 40, revelationType: 'مكية', startPage: 577, juz: 29),
    SurahModel(number: 76, name: 'الإنسان', englishName: 'Al-Insan', totalVerses: 31, revelationType: 'مدنية', startPage: 578, juz: 29),
    SurahModel(number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', totalVerses: 50, revelationType: 'مكية', startPage: 580, juz: 29),
    SurahModel(number: 78, name: 'النبأ', englishName: 'An-Naba', totalVerses: 40, revelationType: 'مكية', startPage: 582, juz: 30),
    SurahModel(number: 79, name: 'النازعات', englishName: 'An-Nazi\'at', totalVerses: 46, revelationType: 'مكية', startPage: 583, juz: 30),
    SurahModel(number: 80, name: 'عبس', englishName: '\'Abasa', totalVerses: 42, revelationType: 'مكية', startPage: 585, juz: 30),
    SurahModel(number: 81, name: 'التكوير', englishName: 'At-Takwir', totalVerses: 29, revelationType: 'مكية', startPage: 586, juz: 30),
    SurahModel(number: 82, name: 'الانفطار', englishName: 'Al-Infitar', totalVerses: 19, revelationType: 'مكية', startPage: 587, juz: 30),
    SurahModel(number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', totalVerses: 36, revelationType: 'مكية', startPage: 587, juz: 30),
    SurahModel(number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', totalVerses: 25, revelationType: 'مكية', startPage: 589, juz: 30),
    SurahModel(number: 85, name: 'البروج', englishName: 'Al-Buruj', totalVerses: 22, revelationType: 'مكية', startPage: 590, juz: 30),
    SurahModel(number: 86, name: 'الطارق', englishName: 'At-Tariq', totalVerses: 17, revelationType: 'مكية', startPage: 591, juz: 30),
    SurahModel(number: 87, name: 'الأعلى', englishName: 'Al-A\'la', totalVerses: 19, revelationType: 'مكية', startPage: 591, juz: 30),
    SurahModel(number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', totalVerses: 26, revelationType: 'مكية', startPage: 592, juz: 30),
    SurahModel(number: 89, name: 'الفجر', englishName: 'Al-Fajr', totalVerses: 30, revelationType: 'مكية', startPage: 593, juz: 30),
    SurahModel(number: 90, name: 'البلد', englishName: 'Al-Balad', totalVerses: 20, revelationType: 'مكية', startPage: 594, juz: 30),
    SurahModel(number: 91, name: 'الشمس', englishName: 'Ash-Shams', totalVerses: 15, revelationType: 'مكية', startPage: 595, juz: 30),
    SurahModel(number: 92, name: 'الليل', englishName: 'Al-Layl', totalVerses: 21, revelationType: 'مكية', startPage: 595, juz: 30),
    SurahModel(number: 93, name: 'الضحى', englishName: 'Ad-Duha', totalVerses: 11, revelationType: 'مكية', startPage: 596, juz: 30),
    SurahModel(number: 94, name: 'الشرح', englishName: 'Ash-Sharh', totalVerses: 8, revelationType: 'مكية', startPage: 596, juz: 30),
    SurahModel(number: 95, name: 'التين', englishName: 'At-Tin', totalVerses: 8, revelationType: 'مكية', startPage: 597, juz: 30),
    SurahModel(number: 96, name: 'العلق', englishName: 'Al-\'Alaq', totalVerses: 19, revelationType: 'مكية', startPage: 597, juz: 30),
    SurahModel(number: 97, name: 'القدر', englishName: 'Al-Qadr', totalVerses: 5, revelationType: 'مكية', startPage: 598, juz: 30),
    SurahModel(number: 98, name: 'البينة', englishName: 'Al-Bayyinah', totalVerses: 8, revelationType: 'مدنية', startPage: 598, juz: 30),
    SurahModel(number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', totalVerses: 8, revelationType: 'مدنية', startPage: 599, juz: 30),
    SurahModel(number: 100, name: 'العاديات', englishName: 'Al-\'Adiyat', totalVerses: 11, revelationType: 'مكية', startPage: 599, juz: 30),
    SurahModel(number: 101, name: 'القارعة', englishName: 'Al-Qari\'ah', totalVerses: 11, revelationType: 'مكية', startPage: 600, juz: 30),
    SurahModel(number: 102, name: 'التكاثر', englishName: 'At-Takathur', totalVerses: 8, revelationType: 'مكية', startPage: 600, juz: 30),
    SurahModel(number: 103, name: 'العصر', englishName: 'Al-\'Asr', totalVerses: 3, revelationType: 'مكية', startPage: 601, juz: 30),
    SurahModel(number: 104, name: 'الهمزة', englishName: 'Al-Humazah', totalVerses: 9, revelationType: 'مكية', startPage: 601, juz: 30),
    SurahModel(number: 105, name: 'الفيل', englishName: 'Al-Fil', totalVerses: 5, revelationType: 'مكية', startPage: 601, juz: 30),
    SurahModel(number: 106, name: 'قريش', englishName: 'Quraysh', totalVerses: 4, revelationType: 'مكية', startPage: 602, juz: 30),
    SurahModel(number: 107, name: 'الماعون', englishName: 'Al-Ma\'un', totalVerses: 7, revelationType: 'مكية', startPage: 602, juz: 30),
    SurahModel(number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', totalVerses: 3, revelationType: 'مكية', startPage: 602, juz: 30),
    SurahModel(number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', totalVerses: 6, revelationType: 'مكية', startPage: 603, juz: 30),
    SurahModel(number: 110, name: 'النصر', englishName: 'An-Nasr', totalVerses: 3, revelationType: 'مدنية', startPage: 603, juz: 30),
    SurahModel(number: 111, name: 'المسد', englishName: 'Al-Masad', totalVerses: 5, revelationType: 'مكية', startPage: 603, juz: 30),
    SurahModel(number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', totalVerses: 4, revelationType: 'مكية', startPage: 604, juz: 30),
    SurahModel(number: 113, name: 'الفلق', englishName: 'Al-Falaq', totalVerses: 5, revelationType: 'مكية', startPage: 604, juz: 30),
    SurahModel(number: 114, name: 'الناس', englishName: 'An-Nas', totalVerses: 6, revelationType: 'مكية', startPage: 604, juz: 30),
  ];

  // Authentic verified Uthmanic verses pre-bundled locally
  static const Map<int, List<String>> _verifiedPreloadedVerses = {
    1: [
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      'الرَّحْمَٰنِ الرَّحِيمِ',
      'مَالِكِ يَوْمِ الدِّينِ',
      'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    ],
    97: [
      'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
      'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
      'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
      'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
    ],
    103: [
      'وَالْعَصْرِ',
      'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
      'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    ],
    105: [
      'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
      'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
      'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
      'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
      'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ',
    ],
    106: [
      'لِإِيلَافِ قُرَيْشٍ',
      'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
      'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ',
      'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ',
    ],
    107: [
      'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ',
      'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
      'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
      'فَوَيْلٌ لِّلْمُصَلِّينَ',
      'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ',
      'الَّذِينَ هُمْ يُرَاءُونَ',
      'وَيَمْنَعُونَ الْمَاعُونَ',
    ],
    108: [
      'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
    ],
    109: [
      'قُلْ يَا أَيُّهَا الْكَافِرُونَ',
      'لَا أَعْبُدُ مَا تَعْبُدُونَ',
      'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
      'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ',
      'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
      'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
    ],
    110: [
      'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
      'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
      'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا',
    ],
    111: [
      'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
      'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ',
      'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ',
      'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ',
      'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ',
    ],
    112: [
      'قُلْ هُوَ اللَّهُ أَحَدٌ',
      'اللَّهُ الصَّمَدُ',
      'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    ],
    113: [
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      'مِن شَرِّ مَا خَلَقَ',
      'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    ],
    114: [
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      'مَلِكِ النَّاسِ',
      'إِلَٰهِ النَّاسِ',
      'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      'مِنَ الْجِنَّةِ وَالنَّاسِ',
    ],
  };

  /// Returns authentic verses if bundled, or loads from external Uthmanic JSON asset.
  /// NO synthetic, placeholder, or generated verses are ever produced.
  static Future<List<AyahModel>> getSurahVerses(int surahNumber) async {
    final surah = allSurahs.firstWhere(
      (s) => s.number == surahNumber,
      orElse: () => allSurahs.first,
    );

    // 1. Check in-memory verified authentic verses
    if (_verifiedPreloadedVerses.containsKey(surahNumber)) {
      final list = _verifiedPreloadedVerses[surahNumber]!;
      return List.generate(list.length, (idx) {
        return AyahModel(
          surahNumber: surahNumber,
          ayahNumber: idx + 1,
          text: list[idx],
          page: surah.startPage,
          juz: surah.juz,
        );
      });
    }

    // 2. Try loading from bundled JSON asset (e.g. assets/data/quran/surah_$surahNumber.json)
    try {
      final jsonString = await rootBundle.loadString('assets/data/quran/surah_$surahNumber.json');
      final List<dynamic> data = jsonDecode(jsonString);
      return data.map((item) {
        return AyahModel(
          surahNumber: surahNumber,
          ayahNumber: item['numberInSurah'] as int,
          text: item['text'] as String,
          page: (item['page'] as int?) ?? surah.startPage,
          juz: (item['juz'] as int?) ?? surah.juz,
        );
      }).toList();
    } catch (_) {
      // Return empty list if external full-quran dataset is not yet copied to assets.
      // Strict rule: NO fake or generated verses.
      return [];
    }
  }

  static bool isSurahPreloaded(int surahNumber) {
    return _verifiedPreloadedVerses.containsKey(surahNumber);
  }
}
