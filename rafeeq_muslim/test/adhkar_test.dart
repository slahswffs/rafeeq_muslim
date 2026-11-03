import 'package:flutter_test/flutter_test.dart';
import 'package:rafeeq_muslim/data/local/adhkar_data.dart';

void main() {
  group('Adhkar Data Tests', () {
    test('Contains all 8 required authentic categories', () {
      final categories = AdhkarData.categories;
      expect(categories.length, 8);

      final ids = categories.map((c) => c.id).toSet();
      expect(ids.contains('morning'), true);
      expect(ids.contains('evening'), true);
      expect(ids.contains('after_prayer'), true);
      expect(ids.contains('sleep'), true);
      expect(ids.contains('waking'), true);
      expect(ids.contains('travel'), true);
      expect(ids.contains('ruqyah'), true);
      expect(ids.contains('general'), true);
    });

    test('All dhikr items have non-empty text, valid target count, and reference citation', () {
      for (final cat in AdhkarData.categories) {
        expect(cat.title.isNotEmpty, true);
        expect(cat.items.isNotEmpty, true);

        for (final item in cat.items) {
          expect(item.id.isNotEmpty, true);
          expect(item.text.isNotEmpty, true);
          expect(item.targetCount, greaterThan(0));
          expect(item.reference.isNotEmpty, true);
          expect(item.fadl.isNotEmpty, true);
        }
      }
    });

    test('Morning dhikr contains Sayyid al-Istighfar and Bismillahilladhi la yadurru', () {
      final morning = AdhkarData.categories.firstWhere((c) => c.id == 'morning');
      final texts = morning.items.map((i) => i.text).join(' ');

      expect(texts.contains('اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ'), true);
      expect(texts.contains('بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ'), true);
    });
  });
}
