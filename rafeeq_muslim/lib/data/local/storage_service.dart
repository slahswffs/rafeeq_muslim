import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/quran_model.dart';
import '../models/prayer_model.dart';
import '../models/settings_model.dart';

class LocalStorageService {
  static const String _keySettings = 'app_settings';
  static const String _keyPrayersPrefix = 'prayer_record_';
  static const String _keyLastRead = 'quran_last_read';
  static const String _keyBookmarks = 'quran_bookmarks';
  static const String _keyTasbeehCount = 'tasbeeh_count';
  static const String _keyTasbeehTarget = 'tasbeeh_target';
  static const String _keyTasbeehDhikr = 'tasbeeh_dhikr';
  static const String _keyTasbeehTotal = 'tasbeeh_total';
  static const String _keyAdhkarPrefix = 'adhkar_count_';
  static const String _keyDailyChecklistPrefix = 'daily_checklist_';

  // App Settings Persistence
  Future<AppSettingsModel> getSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(_keySettings);
    if (data == null) {
      return const AppSettingsModel();
    }
    try {
      final Map<String, dynamic> json = jsonDecode(data);
      return AppSettingsModel(
        cityName: json['cityName'] as String? ?? 'مكة المكرمة',
        countryName: json['countryName'] as String? ?? 'المملكة العربية السعودية',
        latitude: (json['latitude'] as num?)?.toDouble() ?? 21.4225,
        longitude: (json['longitude'] as num?)?.toDouble() ?? 39.8262,
        timezoneOffset: (json['timezoneOffset'] as num?)?.toDouble() ?? 3.0,
        calcMethod: PrayerCalcMethod.values.firstWhere(
          (m) => m.name == json['calcMethod'],
          orElse: () => PrayerCalcMethod.ummAlQura,
        ),
        asrMethod: AsrJuristicMethod.values.firstWhere(
          (m) => m.name == json['asrMethod'],
          orElse: () => AsrJuristicMethod.standard,
        ),
        themeMode: AppThemeMode.values.firstWhere(
          (t) => t.name == json['themeMode'],
          orElse: () => AppThemeMode.light,
        ),
        hijriDayAdjustment: json['hijriDayAdjustment'] as int? ?? 0,
        notificationsEnabled: json['notificationsEnabled'] as bool? ?? true,
        quranFontSize: (json['quranFontSize'] as num?)?.toDouble() ?? 22.0,
      );
    } catch (_) {
      return const AppSettingsModel();
    }
  }

  Future<void> saveSettings(AppSettingsModel settings) async {
    final prefs = await SharedPreferences.getInstance();
    final map = {
      'cityName': settings.cityName,
      'countryName': settings.countryName,
      'latitude': settings.latitude,
      'longitude': settings.longitude,
      'timezoneOffset': settings.timezoneOffset,
      'calcMethod': settings.calcMethod.name,
      'asrMethod': settings.asrMethod.name,
      'themeMode': settings.themeMode.name,
      'hijriDayAdjustment': settings.hijriDayAdjustment,
      'notificationsEnabled': settings.notificationsEnabled,
      'quranFontSize': settings.quranFontSize,
    };
    await prefs.setString(_keySettings, jsonEncode(map));
  }

  // Daily Prayer Records Persistence
  Future<DayPrayerRecord> getDayPrayerRecord(String dateStr) async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('$_keyPrayersPrefix$dateStr');
    if (data == null) {
      return DayPrayerRecord.empty(dateStr);
    }
    try {
      final Map<String, dynamic> decoded = jsonDecode(data);
      final map = <PrayerType, bool>{};
      for (final p in PrayerType.values) {
        map[p] = decoded[p.name] == true;
      }
      return DayPrayerRecord(dateString: dateStr, completedPrayers: map);
    } catch (_) {
      return DayPrayerRecord.empty(dateStr);
    }
  }

  Future<void> saveDayPrayerRecord(DayPrayerRecord record) async {
    final prefs = await SharedPreferences.getInstance();
    final map = <String, bool>{};
    record.completedPrayers.forEach((k, v) {
      map[k.name] = v;
    });
    await prefs.setString('$_keyPrayersPrefix${record.dateString}', jsonEncode(map));
  }

  // Daily Habits Checklist Persistence (Quran, Morning, Evening, Sadaqah)
  Future<Map<String, bool>> getDailyChecklist(String dateStr) async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('$_keyDailyChecklistPrefix$dateStr');
    if (data == null) return {};
    try {
      final Map<String, dynamic> decoded = jsonDecode(data);
      return decoded.map((key, value) => MapEntry(key, value == true));
    } catch (_) {
      return {};
    }
  }

  Future<void> saveDailyChecklist(String dateStr, Map<String, bool> checklist) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('$_keyDailyChecklistPrefix$dateStr', jsonEncode(checklist));
  }

  // Quran Persistence
  Future<QuranLastReadPosition> getLastReadPosition() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(_keyLastRead);
    if (data == null) {
      return QuranLastReadPosition.initial();
    }
    try {
      return QuranLastReadPosition.fromJson(jsonDecode(data));
    } catch (_) {
      return QuranLastReadPosition.initial();
    }
  }

  Future<void> saveLastReadPosition(QuranLastReadPosition pos) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyLastRead, jsonEncode(pos.toJson()));
  }

  Future<List<QuranBookmark>> getBookmarks() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_keyBookmarks);
    if (list == null) return [];
    try {
      return list.map((item) => QuranBookmark.fromJson(jsonDecode(item))).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveBookmarks(List<QuranBookmark> bookmarks) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = bookmarks.map((b) => jsonEncode(b.toJson())).toList();
    await prefs.setStringList(_keyBookmarks, encoded);
  }

  // Tasbeeh Persistence
  Future<int> getTasbeehCount() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyTasbeehCount) ?? 0;
  }

  Future<void> saveTasbeehCount(int count) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyTasbeehCount, count);
  }

  Future<int> getTasbeehTarget() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyTasbeehTarget) ?? 33;
  }

  Future<void> saveTasbeehTarget(int target) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyTasbeehTarget, target);
  }

  Future<String> getTasbeehDhikr() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyTasbeehDhikr) ?? 'سبحان الله وبحمده';
  }

  Future<void> saveTasbeehDhikr(String dhikr) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyTasbeehDhikr, dhikr);
  }

  Future<int> getTasbeehTotal() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyTasbeehTotal) ?? 0;
  }

  Future<void> saveTasbeehTotal(int total) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyTasbeehTotal, total);
  }

  // Adhkar Counter Persistence
  Future<int> getAdhkarItemCount(String dateStr, String itemId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('$_keyAdhkarPrefix${dateStr}_$itemId') ?? 0;
  }

  Future<void> saveAdhkarItemCount(String dateStr, String itemId, int count) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('$_keyAdhkarPrefix${dateStr}_$itemId', count);
  }
}
