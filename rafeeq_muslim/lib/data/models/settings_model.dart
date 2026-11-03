enum AppThemeMode { light, dark, system }
enum AsrJuristicMethod { standard, hanafi }
enum PrayerCalcMethod { ummAlQura, mwl, egypt, isna, karachi, dubai }

class AppSettingsModel {
  final AppThemeMode themeMode;
  final double fontSizeMultiplier;
  final String cityName;
  final String countryName;
  final double latitude;
  final double longitude;
  final double timezoneOffset;
  final PrayerCalcMethod calcMethod;
  final AsrJuristicMethod asrMethod;
  final bool notificationsEnabled;
  final bool soundEnabled;
  final bool vibrationEnabled;
  final int hijriDayAdjustment;

  const AppSettingsModel({
    this.themeMode = AppThemeMode.light,
    this.fontSizeMultiplier = 1.0,
    this.cityName = 'مكة المكرمة',
    this.countryName = 'المملكة العربية السعودية',
    this.latitude = 21.4225,
    this.longitude = 39.8262,
    this.timezoneOffset = 3.0,
    this.calcMethod = PrayerCalcMethod.ummAlQura,
    this.asrMethod = AsrJuristicMethod.standard,
    this.notificationsEnabled = true,
    this.soundEnabled = true,
    this.vibrationEnabled = true,
    this.hijriDayAdjustment = 0,
  });

  AppSettingsModel copyWith({
    AppThemeMode? themeMode,
    double? fontSizeMultiplier,
    String? cityName,
    String? countryName,
    double? latitude,
    double? longitude,
    double? timezoneOffset,
    PrayerCalcMethod? calcMethod,
    AsrJuristicMethod? asrMethod,
    bool? notificationsEnabled,
    bool? soundEnabled,
    bool? vibrationEnabled,
    int? hijriDayAdjustment,
  }) {
    return AppSettingsModel(
      themeMode: themeMode ?? this.themeMode,
      fontSizeMultiplier: fontSizeMultiplier ?? this.fontSizeMultiplier,
      cityName: cityName ?? this.cityName,
      countryName: countryName ?? this.countryName,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      timezoneOffset: timezoneOffset ?? this.timezoneOffset,
      calcMethod: calcMethod ?? this.calcMethod,
      asrMethod: asrMethod ?? this.asrMethod,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      soundEnabled: soundEnabled ?? this.soundEnabled,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
      hijriDayAdjustment: hijriDayAdjustment ?? this.hijriDayAdjustment,
    );
  }
}
