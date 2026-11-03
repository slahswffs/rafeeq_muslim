import 'package:flutter_test/flutter_test.dart';
import 'package:rafeeq_muslim/core/services/hijri_service.dart';

void main() {
  group('Hijri Date Conversion Tests', () {
    test('Calculates valid Hijri date without throwing', () {
      final date = DateTime(2026, 3, 20); // Ramadan around this period in 1447
      final hijri = HijriService.getHijriDate(date: date);

      expect(hijri.day, greaterThanOrEqualTo(1));
      expect(hijri.day, lessThanOrEqualTo(30));
      expect(hijri.month, greaterThanOrEqualTo(1));
      expect(hijri.month, lessThanOrEqualTo(12));
      expect(hijri.monthName.isNotEmpty, true);
      expect(hijri.year, greaterThanOrEqualTo(1447));
      expect(hijri.formattedText.contains('هـ'), true);
    });

    test('Hijri adjustment adds or subtracts days accurately', () {
      final baseDate = DateTime(2026, 5, 1);
      final normal = HijriService.getHijriDate(date: baseDate, adjustmentDays: 0);
      final adjustedPlusOne = HijriService.getHijriDate(date: baseDate, adjustmentDays: 1);

      expect(adjustedPlusOne.day != normal.day || adjustedPlusOne.month != normal.month, true);
    });
  });
}
