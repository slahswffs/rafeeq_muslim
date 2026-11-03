import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/services/notification_service.dart';
import '../core/services/prayer_service.dart';
import '../data/local/storage_service.dart';
import '../data/models/achievement_model.dart';
import '../data/models/prayer_model.dart';
import '../data/models/quran_model.dart';
import '../data/models/settings_model.dart';
import '../data/repositories/adhkar_repository.dart';
import '../data/repositories/prayer_repository.dart';
import '../data/repositories/quran_repository.dart';

// Service & Repository Singletons
final prayerServiceProvider = Provider<PrayerService>((ref) => PrayerService());
final localStorageServiceProvider = Provider<LocalStorageService>((ref) => LocalStorageService());
final notificationServiceProvider = Provider<NotificationService>((ref) => NotificationService());

final prayerRepositoryProvider = Provider<PrayerRepository>((ref) {
  return PrayerRepository(
    prayerService: ref.watch(prayerServiceProvider),
    storageService: ref.watch(localStorageServiceProvider),
  );
});

final quranRepositoryProvider = Provider<QuranRepository>((ref) {
  return QuranRepository(storageService: ref.watch(localStorageServiceProvider));
});

final adhkarRepositoryProvider = Provider<AdhkarRepository>((ref) {
  return AdhkarRepository(storageService: ref.watch(localStorageServiceProvider));
});

// App Settings State Notifier with persistent SharedPreferences backing
class SettingsNotifier extends StateNotifier<AppSettingsModel> {
  final LocalStorageService _storage;
  final NotificationService _notifications;

  SettingsNotifier(this._storage, this._notifications) : super(const AppSettingsModel()) {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final saved = await _storage.getSettings();
    state = saved;
  }

  Future<void> updateSettings(AppSettingsModel newSettings) async {
    state = newSettings;
    await _storage.saveSettings(newSettings);
  }

  Future<void> updateCity({
    required String cityName,
    required String countryName,
    required double lat,
    required double lng,
    required double timezoneOffset,
  }) async {
    state = state.copyWith(
      cityName: cityName,
      countryName: countryName,
      latitude: lat,
      longitude: lng,
      timezoneOffset: timezoneOffset,
    );
    await _storage.saveSettings(state);
  }

  Future<void> toggleTheme(AppThemeMode mode) async {
    state = state.copyWith(themeMode: mode);
    await _storage.saveSettings(state);
  }

  Future<void> updateCalcMethod(PrayerCalcMethod method) async {
    state = state.copyWith(calcMethod: method);
    await _storage.saveSettings(state);
  }

  Future<void> updateAsrMethod(AsrJuristicMethod method) async {
    state = state.copyWith(asrMethod: method);
    await _storage.saveSettings(state);
  }

  Future<void> updateHijriAdjustment(int days) async {
    state = state.copyWith(hijriDayAdjustment: days);
    await _storage.saveSettings(state);
  }

  Future<void> toggleNotifications(bool enabled) async {
    state = state.copyWith(notificationsEnabled: enabled);
    await _storage.saveSettings(state);
    if (!enabled) {
      await _notifications.cancelAllNotifications();
    }
  }

  Future<void> updateQuranFontSize(double size) async {
    state = state.copyWith(quranFontSize: size);
    await _storage.saveSettings(state);
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, AppSettingsModel>((ref) {
  return SettingsNotifier(
    ref.watch(localStorageServiceProvider),
    ref.watch(notificationServiceProvider),
  );
});

// Today's Prayer Times
final prayerTimesProvider = Provider<List<PrayerTimeEntry>>((ref) {
  final settings = ref.watch(settingsProvider);
  final repo = ref.watch(prayerRepositoryProvider);
  final prayers = repo.getTodayPrayers(settings, DateTime.now());

  // Auto-schedule notification if enabled
  if (settings.notificationsEnabled) {
    ref.read(notificationServiceProvider).scheduleAllPrayers(prayers);
  }

  return prayers;
});

// Next Prayer Provider with city timezone awareness
final nextPrayerProvider = Provider<PrayerTimeEntry>((ref) {
  final settings = ref.watch(settingsProvider);
  final prayers = ref.watch(prayerTimesProvider);
  final service = ref.watch(prayerServiceProvider);
  return service.getNextPrayer(prayers, timezoneOffset: settings.timezoneOffset);
});

// Helper for formatted date key
String getTodayDateString([DateTime? date]) {
  final target = date ?? DateTime.now();
  return '${target.year}-${target.month.toString().padLeft(2, '0')}-${target.day.toString().padLeft(2, '0')}';
}

// Prayer Record Notifier
class TodayPrayerNotifier extends StateNotifier<AsyncValue<DayPrayerRecord>> {
  final PrayerRepository _repository;
  final String _dateString;

  TodayPrayerNotifier(this._repository, this._dateString)
      : super(const AsyncValue.loading()) {
    _loadRecord();
  }

  Future<void> _loadRecord() async {
    try {
      final rec = await _repository.getDayRecord(_dateString);
      state = AsyncValue.data(rec);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> toggle(PrayerType type) async {
    final updated = await _repository.togglePrayer(_dateString, type);
    state = AsyncValue.data(updated);
  }
}

final todayPrayerRecordProvider =
    StateNotifierProvider<TodayPrayerNotifier, AsyncValue<DayPrayerRecord>>((ref) {
  final repo = ref.watch(prayerRepositoryProvider);
  return TodayPrayerNotifier(repo, getTodayDateString());
});

// Past 7 Days Prayer Records Provider for Weekly Progress
final pastWeekPrayerCountsProvider = FutureProvider<List<int>>((ref) async {
  final storage = ref.watch(localStorageServiceProvider);
  final now = DateTime.now();
  final counts = <int>[];

  for (int i = 6; i >= 0; i--) {
    final date = now.subtract(Duration(days: i));
    final dateStr = getTodayDateString(date);
    final record = await storage.getDayPrayerRecord(dateStr);
    counts.add(record.completedCount);
  }

  return counts;
});

// Tasbeeh State Notifier
class TasbeehState {
  final int count;
  final int target;
  final String dhikr;
  final int totalLifetime;

  const TasbeehState({
    required this.count,
    required this.target,
    required this.dhikr,
    required this.totalLifetime,
  });

  TasbeehState copyWith({
    int? count,
    int? target,
    String? dhikr,
    int? totalLifetime,
  }) {
    return TasbeehState(
      count: count ?? this.count,
      target: target ?? this.target,
      dhikr: dhikr ?? this.dhikr,
      totalLifetime: totalLifetime ?? this.totalLifetime,
    );
  }
}

class TasbeehNotifier extends StateNotifier<TasbeehState> {
  final LocalStorageService _storage;

  TasbeehNotifier(this._storage)
      : super(const TasbeehState(
          count: 0,
          target: 33,
          dhikr: 'سبحان الله وبحمده',
          totalLifetime: 0,
        )) {
    _load();
  }

  Future<void> _load() async {
    final count = await _storage.getTasbeehCount();
    final target = await _storage.getTasbeehTarget();
    final dhikr = await _storage.getTasbeehDhikr();
    final total = await _storage.getTasbeehTotal();
    state = TasbeehState(count: count, target: target, dhikr: dhikr, totalLifetime: total);
  }

  void increment() {
    final nextCount = state.count + 1;
    final nextTotal = state.totalLifetime + 1;
    state = state.copyWith(count: nextCount, totalLifetime: nextTotal);
    _storage.saveTasbeehCount(nextCount);
    _storage.saveTasbeehTotal(nextTotal);
  }

  void reset() {
    state = state.copyWith(count: 0);
    _storage.saveTasbeehCount(0);
  }

  void setDhikr(String dhikr) {
    state = state.copyWith(dhikr: dhikr, count: 0);
    _storage.saveTasbeehDhikr(dhikr);
    _storage.saveTasbeehCount(0);
  }

  void setTarget(int target) {
    state = state.copyWith(target: target);
    _storage.saveTasbeehTarget(target);
  }
}

final tasbeehProvider = StateNotifierProvider<TasbeehNotifier, TasbeehState>((ref) {
  return TasbeehNotifier(ref.watch(localStorageServiceProvider));
});

// Quran Last Read Position Notifier
class QuranLastReadNotifier extends StateNotifier<QuranLastReadPosition> {
  final QuranRepository _repository;

  QuranLastReadNotifier(this._repository) : super(QuranLastReadPosition.initial()) {
    _load();
  }

  Future<void> _load() async {
    state = await _repository.getLastReadPosition();
  }

  Future<void> setPosition(QuranLastReadPosition pos) async {
    state = pos;
    await _repository.saveLastReadPosition(pos);
  }
}

final quranLastReadProvider =
    StateNotifierProvider<QuranLastReadNotifier, QuranLastReadPosition>((ref) {
  return QuranLastReadNotifier(ref.watch(quranRepositoryProvider));
});

// Achievements dynamic provider connected to real user records
final achievementsProvider = Provider<List<AchievementModel>>((ref) {
  final tasbeeh = ref.watch(tasbeehProvider);
  final lastRead = ref.watch(quranLastReadProvider);
  final todayAsync = ref.watch(todayPrayerRecordProvider);

  int todayPrayers = 0;
  todayAsync.whenData((rec) => todayPrayers = rec.completedCount);

  return [
    AchievementModel(
      id: 'first_prayer',
      title: 'أول صلاة مسجلة',
      description: 'تسجيل أول صلاة لك في تطبيق رفيق المسلم بنجاح',
      iconKey: 'sparkles',
      maxProgress: 1,
      currentProgress: todayPrayers > 0 ? 1 : 0,
    ),
    AchievementModel(
      id: 'streak_3_days',
      title: 'المحافظة على الصلاة',
      description: 'أداء 3 صلوات مفروضة على الأقل في اليوم',
      iconKey: 'flame',
      maxProgress: 3,
      currentProgress: todayPrayers.clamp(0, 3),
    ),
    AchievementModel(
      id: 'streak_5_prayers',
      title: 'يوم مبارك تام',
      description: 'إتمام الصلوات الخمس المفروضة كاملة اليوم',
      iconKey: 'trophy',
      maxProgress: 5,
      currentProgress: todayPrayers.clamp(0, 5),
    ),
    AchievementModel(
      id: 'tasbeeh_100',
      title: 'مئة تسبيحة',
      description: 'إتمام 100 تسبيحة في السبحة الإلكترونية',
      iconKey: 'circle_dot',
      maxProgress: 100,
      currentProgress: tasbeeh.totalLifetime.clamp(0, 100),
    ),
    AchievementModel(
      id: 'tasbeeh_1000',
      title: 'ألف ذكر لله',
      description: 'إتمام 1000 تسبيحة وذكر لله تعالى',
      iconKey: 'crown',
      maxProgress: 1000,
      currentProgress: tasbeeh.totalLifetime.clamp(0, 1000),
    ),
    AchievementModel(
      id: 'first_juz',
      title: 'حافظ الورد',
      description: 'متابعة قراءة القرآن الكريم وحفظ آخر موضع قراءة',
      iconKey: 'book_open',
      maxProgress: 1,
      currentProgress: (lastRead.surahNumber > 1 || lastRead.ayahNumber > 1) ? 1 : 0,
    ),
  ];
});
