import 'dart:math';
import 'package:adhan/adhan.dart';
import '../../data/models/prayer_model.dart';
import '../../data/models/settings_model.dart';

class PrayerService {
  // Kaaba Coordinates
  static const double kaabaLat = 21.422487;
  static const double kaabaLng = 39.826206;

  List<PrayerTimeEntry> getPrayerTimes({
    required double latitude,
    required double longitude,
    required DateTime date,
    double? timezoneOffset,
    PrayerCalcMethod method = PrayerCalcMethod.ummAlQura,
    AsrJuristicMethod asrMethod = AsrJuristicMethod.standard,
  }) {
    final myCoordinates = Coordinates(latitude, longitude);
    final params = _getCalculationParameters(method);
    params.madhab = asrMethod == AsrJuristicMethod.hanafi ? Madhab.hanafi : Madhab.shafi;

    // Ensure the year/month/day matches the city's current local date
    final cityDate = timezoneOffset != null
        ? date.toUtc().add(Duration(minutes: (timezoneOffset * 60).round()))
        : date;
    final dateComponents = DateComponents(cityDate.year, cityDate.month, cityDate.day);
    final prayerTimes = PrayerTimes(myCoordinates, dateComponents, params);

    return [
      _createEntry(PrayerType.fajr, 'الفجر', prayerTimes.fajr, timezoneOffset),
      _createEntry(PrayerType.sunrise, 'الشروق', prayerTimes.sunrise, timezoneOffset),
      _createEntry(PrayerType.dhuhr, 'الظهر', prayerTimes.dhuhr, timezoneOffset),
      _createEntry(PrayerType.asr, 'العصر', prayerTimes.asr, timezoneOffset),
      _createEntry(PrayerType.maghrib, 'المغرب', prayerTimes.maghrib, timezoneOffset),
      _createEntry(PrayerType.isha, 'العشاء', prayerTimes.isha, timezoneOffset),
    ];
  }

  CalculationParameters _getCalculationParameters(PrayerCalcMethod method) {
    switch (method) {
      case PrayerCalcMethod.ummAlQura:
        return CalculationMethod.umm_al_qura.getParameters();
      case PrayerCalcMethod.mwl:
        return CalculationMethod.muslim_world_league.getParameters();
      case PrayerCalcMethod.egypt:
        return CalculationMethod.egyptian.getParameters();
      case PrayerCalcMethod.isna:
        return CalculationMethod.north_america.getParameters();
      case PrayerCalcMethod.karachi:
        return CalculationMethod.karachi.getParameters();
      case PrayerCalcMethod.dubai:
        return CalculationMethod.dubai.getParameters();
    }
  }

  PrayerTimeEntry _createEntry(
    PrayerType type,
    String arabicName,
    DateTime time,
    double? timezoneOffset,
  ) {
    DateTime adjustedTime;
    if (timezoneOffset != null) {
      adjustedTime = time.toUtc().add(Duration(minutes: (timezoneOffset * 60).round()));
    } else {
      adjustedTime = time.toLocal();
    }

    final hour = adjustedTime.hour;
    final minute = adjustedTime.minute;
    final period = hour >= 12 ? 'م' : 'ص';
    final displayHour = hour % 12 == 0 ? 12 : hour % 12;
    final formattedTime =
        '${displayHour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')} $period';

    return PrayerTimeEntry(
      type: type,
      arabicName: arabicName,
      time: adjustedTime,
      formattedTime: formattedTime,
    );
  }

  PrayerTimeEntry getNextPrayer(
    List<PrayerTimeEntry> prayers, {
    DateTime? now,
    double? timezoneOffset,
  }) {
    final current = now ??
        (timezoneOffset != null
            ? DateTime.now().toUtc().add(Duration(minutes: (timezoneOffset * 60).round()))
            : DateTime.now());
    final actualPrayers = prayers.where((p) => p.type != PrayerType.sunrise).toList();

    for (final p in actualPrayers) {
      if (p.time.isAfter(current)) {
        return p;
      }
    }

    // If passed all today, next is Fajr tomorrow
    final fajr = actualPrayers.first;
    return fajr.copyWith(time: fajr.time.add(const Duration(days: 1)));
  }

  String formatRemainingDuration(Duration duration) {
    if (duration.isNegative) duration = Duration.zero;
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    final seconds = duration.inSeconds.remainder(60);

    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  // Calculate Qibla spherical bearing angle from true north
  double calculateQiblaAngle(double userLat, double userLng) {
    final lat1 = userLat * pi / 180.0;
    final lng1 = userLng * pi / 180.0;
    final lat2 = kaabaLat * pi / 180.0;
    final lng2 = kaabaLng * pi / 180.0;

    final dLng = lng2 - lng1;
    final y = sin(dLng);
    final x = cos(lat1) * tan(lat2) - sin(lat1) * cos(dLng);

    double qibla = atan2(y, x) * 180.0 / pi;
    if (qibla.isNaN) return 0.0;
    return (qibla + 360.0) % 360.0;
  }

  // Calculate Distance to Makkah in Kilometers using Haversine
  int calculateDistanceToKaaba(double userLat, double userLng) {
    const double earthRadiusKm = 6371.0;
    final dLat = (kaabaLat - userLat) * pi / 180.0;
    final dLng = (kaabaLng - userLng) * pi / 180.0;

    final a = sin(dLat / 2) * sin(dLat / 2) +
        cos(userLat * pi / 180.0) * cos(kaabaLat * pi / 180.0) * sin(dLng / 2) * sin(dLng / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));
    if (c.isNaN) return 0;
    return (earthRadiusKm * c).round();
  }
}
