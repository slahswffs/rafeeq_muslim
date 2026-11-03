class HijriService {
  static const List<String> arabicMonths = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  static const List<String> arabicWeekdays = [
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
    'الأحد',
  ];

  static HijriDateModel getHijriDate({DateTime? date, int adjustmentDays = 0}) {
    final targetDate = (date ?? DateTime.now()).add(Duration(days: adjustmentDays));
    final weekdayName = arabicWeekdays[targetDate.weekday - 1];

    // Algorithmic conversion from Gregorian to Hijri
    final day = targetDate.day;
    final month = targetDate.month;
    final year = targetDate.year;

    int m = month;
    int y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    final a = (y / 100).floor();
    final b = 2 - a + (a / 4).floor();
    final jd = (365.25 * (y + 4716)).floor() + (30.6001 * (m + 1)).floor() + day + b - 1524;

    const epoch = 1948439.5;
    final l = jd - epoch;
    final n = (30 * l + 10646) ~/ 10631;
    final j = jd - (10631 * n + 5844) ~/ 30 + 1;
    final hijriMonth = ((11 * j + 330) ~/ 325).clamp(1, 12);
    final hijriDay = (j - (325 * hijriMonth - 320) ~/ 11).clamp(1, 30);
    final hijriYear = (n + 1);

    final monthName = arabicMonths[hijriMonth - 1];

    return HijriDateModel(
      day: hijriDay,
      month: hijriMonth,
      monthName: monthName,
      year: hijriYear,
      weekdayName: weekdayName,
      formattedText: '$weekdayName، $hijriDay $monthName $hijriYear هـ',
      gregorianText: '${targetDate.day}/${targetDate.month}/${targetDate.year} م',
    );
  }
}

class HijriDateModel {
  final int day;
  final int month;
  final String monthName;
  final int year;
  final String weekdayName;
  final String formattedText;
  final String gregorianText;

  const HijriDateModel({
    required this.day,
    required this.month,
    required this.monthName,
    required this.year,
    required this.weekdayName,
    required this.formattedText,
    required this.gregorianText,
  });
}
