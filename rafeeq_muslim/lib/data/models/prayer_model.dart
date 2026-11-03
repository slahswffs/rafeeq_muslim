enum PrayerType { fajr, sunrise, dhuhr, asr, maghrib, isha }

class PrayerTimeEntry {
  final PrayerType type;
  final String arabicName;
  final DateTime time;
  final String formattedTime;
  final bool isCompleted;

  const PrayerTimeEntry({
    required this.type,
    required this.arabicName,
    required this.time,
    required this.formattedTime,
    this.isCompleted = false,
  });

  PrayerTimeEntry copyWith({
    PrayerType? type,
    String? arabicName,
    DateTime? time,
    String? formattedTime,
    bool? isCompleted,
  }) {
    return PrayerTimeEntry(
      type: type ?? this.type,
      arabicName: arabicName ?? this.arabicName,
      time: time ?? this.time,
      formattedTime: formattedTime ?? this.formattedTime,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

class DayPrayerRecord {
  final String dateString; // YYYY-MM-DD
  final Map<PrayerType, bool> completedPrayers;

  const DayPrayerRecord({
    required this.dateString,
    required this.completedPrayers,
  });

  int get completedCount {
    int count = 0;
    // Obligatory 5 prayers (excluding sunrise)
    final obligatory = [
      PrayerType.fajr,
      PrayerType.dhuhr,
      PrayerType.asr,
      PrayerType.maghrib,
      PrayerType.isha,
    ];
    for (final p in obligatory) {
      if (completedPrayers[p] == true) count++;
    }
    return count;
  }

  factory DayPrayerRecord.empty(String dateStr) {
    return DayPrayerRecord(
      dateString: dateStr,
      completedPrayers: {
        PrayerType.fajr: false,
        PrayerType.sunrise: false,
        PrayerType.dhuhr: false,
        PrayerType.asr: false,
        PrayerType.maghrib: false,
        PrayerType.isha: false,
      },
    );
  }
}
