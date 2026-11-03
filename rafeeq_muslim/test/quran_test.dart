import 'package:flutter_test/flutter_test.dart';
import 'package:rafeeq_muslim/data/local/quran_data.dart';

void main() {
  group('Quran Data & Repository Tests', () {
    test('Contains exactly 114 Surahs with unique sequential numbers 1 to 114', () {
      final surahs = QuranData.allSurahs;
      expect(surahs.length, 114);

      for (int i = 0; i < 114; i++) {
        expect(surahs[i].number, i + 1);
        expect(surahs[i].name.isNotEmpty, true);
        expect(surahs[i].englishName.isNotEmpty, true);
        expect(surahs[i].totalVerses, greaterThan(0));
        expect(surahs[i].revelationType.isNotEmpty, true);
        expect(surahs[i].startPage, greaterThan(0));
        expect(surahs[i].juz, greaterThanOrEqualTo(1));
        expect(surahs[i].juz, lessThanOrEqualTo(30));
      }
    });

    test('Al-Fatihah (Surah 1) has 7 authentic verses in preloaded memory', () async {
      final verses = await QuranData.getSurahVerses(1);
      expect(verses.length, 7);
      expect(verses[0].text, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
      expect(verses[0].ayahNumber, 1);
      expect(verses[6].ayahNumber, 7);
    });

    test('Al-Ikhlas (Surah 112) has 4 authentic verses in preloaded memory', () async {
      final verses = await QuranData.getSurahVerses(112);
      expect(verses.length, 4);
      expect(verses[0].text, 'قُلْ هُوَ اللَّهُ أَحَدٌ');
      expect(verses[1].text, 'اللَّهُ الصَّمَدُ');
      expect(verses[2].text, 'لَمْ يَلِدْ وَلَمْ يُولَدْ');
      expect(verses[3].text, 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ');
    });

    test('isSurahPreloaded accurately returns true for preloaded surahs and false for others', () {
      expect(QuranData.isSurahPreloaded(1), true);
      expect(QuranData.isSurahPreloaded(112), true);
      expect(QuranData.isSurahPreloaded(114), true);
      expect(QuranData.isSurahPreloaded(2), false); // Al-Baqarah requires external asset
    });
  });
}
