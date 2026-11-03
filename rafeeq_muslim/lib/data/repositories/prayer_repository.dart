import '../../core/services/prayer_service.dart';
import '../local/storage_service.dart';
import '../models/prayer_model.dart';
import '../models/settings_model.dart';

class PrayerRepository {
  final PrayerService _prayerService;
  final LocalStorageService _storageService;

  PrayerRepository({
    required PrayerService prayerService,
    required LocalStorageService storageService,
  })  : _prayerService = prayerService,
        _storageService = storageService;

  List<PrayerTimeEntry> getTodayPrayers(AppSettingsModel settings, DateTime date) {
    return _prayerService.getPrayerTimes(
      latitude: settings.latitude,
      longitude: settings.longitude,
      date: date,
      timezoneOffset: settings.timezoneOffset,
      method: settings.calcMethod,
      asrMethod: settings.asrMethod,
    );
  }

  Future<DayPrayerRecord> getDayRecord(String dateString) async {
    return await _storageService.getDayPrayerRecord(dateString);
  }

  Future<DayPrayerRecord> togglePrayer(String dateString, PrayerType type) async {
    final current = await _storageService.getDayPrayerRecord(dateString);
    final isDone = current.completedPrayers[type] ?? false;
    final updatedMap = Map<PrayerType, bool>.from(current.completedPrayers);
    updatedMap[type] = !isDone;

    final updated = DayPrayerRecord(dateString: dateString, completedPrayers: updatedMap);
    await _storageService.saveDayPrayerRecord(updated);
    return updated;
  }
}
