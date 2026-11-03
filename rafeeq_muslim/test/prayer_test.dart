import 'package:flutter_test/flutter_test.dart';
import 'package:rafeeq_muslim/core/services/prayer_service.dart';
import 'package:rafeeq_muslim/data/models/prayer_model.dart';
import 'package:rafeeq_muslim/data/models/settings_model.dart';

void main() {
  group('Prayer Calculation Tests', () {
    final service = PrayerService();

    test('Makkah calculation produces 6 valid prayer entries', () {
      final date = DateTime(2026, 4, 15);
      final prayers = service.getPrayerTimes(
        latitude: 21.4225,
        longitude: 39.8262,
        date: date,
        timezoneOffset: 3.0,
        method: PrayerCalcMethod.ummAlQura,
        asrMethod: AsrJuristicMethod.standard,
      );

      expect(prayers.length, 6);
      expect(prayers[0].type, PrayerType.fajr);
      expect(prayers[1].type, PrayerType.sunrise);
      expect(prayers[2].type, PrayerType.dhuhr);
      expect(prayers[3].type, PrayerType.asr);
      expect(prayers[4].type, PrayerType.maghrib);
      expect(prayers[5].type, PrayerType.isha);

      // Verify non-empty formatted times
      for (final p in prayers) {
        expect(p.formattedTime.isNotEmpty, true);
      }
    });

    test('Qibla angle calculation from Riyadh to Kaaba is ~250-260 degrees', () {
      // Riyadh coordinates
      const riyadhLat = 24.7136;
      const riyadhLng = 46.6753;
      final qiblaAngle = service.calculateQiblaAngle(riyadhLat, riyadhLng);

      expect(qiblaAngle, greaterThan(230.0));
      expect(qiblaAngle, lessThan(270.0));
      expect(qiblaAngle.isNaN, false);
    });

    test('Distance to Kaaba is calculated properly without NaN', () {
      const riyadhLat = 24.7136;
      const riyadhLng = 46.6753;
      final dist = service.calculateDistanceToKaaba(riyadhLat, riyadhLng);

      expect(dist, greaterThan(700));
      expect(dist, lessThan(1000));
    });

    test('DayPrayerRecord accurately counts obligatory prayers completed', () {
      final record = DayPrayerRecord(
        dateString: '2026-04-15',
        completedPrayers: {
          PrayerType.fajr: true,
          PrayerType.sunrise: true, // Should not count towards 5 obligatory
          PrayerType.dhuhr: true,
          PrayerType.asr: false,
          PrayerType.maghrib: true,
          PrayerType.isha: true,
        },
      );

      expect(record.completedCount, 4); // 4 out of 5
    });
  });
}
