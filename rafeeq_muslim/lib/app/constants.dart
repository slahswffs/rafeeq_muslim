class AppConstants {
  static const String appName = 'رفيق المسلم';
  static const String appTagline = 'رفيقك في طريق الطمأنينة';

  // Default coordinates (Makkah)
  static const double defaultLat = 21.4225;
  static const double defaultLng = 39.8262;
  static const String defaultCity = 'مكة المكرمة';
  static const String defaultCountry = 'المملكة العربية السعودية';
  static const double defaultTimezoneOffset = 3.0;

  // Predefined major Islamic cities with accurate timezone offsets
  static const List<CityData> presetCities = [
    CityData(name: 'مكة المكرمة', country: 'السعودية', lat: 21.4225, lng: 39.8262, timezoneOffset: 3.0),
    CityData(name: 'المدينة المنورة', country: 'السعودية', lat: 24.4672, lng: 39.6112, timezoneOffset: 3.0),
    CityData(name: 'الرياض', country: 'السعودية', lat: 24.7136, lng: 46.6753, timezoneOffset: 3.0),
    CityData(name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357, timezoneOffset: 2.0),
    CityData(name: 'القدس الشريف', country: 'فلسطين', lat: 31.7683, lng: 35.2137, timezoneOffset: 3.0),
    CityData(name: 'دبي', country: 'الإمارات', lat: 25.2048, lng: 55.2708, timezoneOffset: 4.0),
    CityData(name: 'عمان', country: 'الأردن', lat: 31.9454, lng: 35.9284, timezoneOffset: 3.0),
    CityData(name: 'الكويت', country: 'الكويت', lat: 29.3759, lng: 47.9774, timezoneOffset: 3.0),
    CityData(name: 'الدوحة', country: 'قطر', lat: 25.2854, lng: 51.5310, timezoneOffset: 3.0),
    CityData(name: 'المنامة', country: 'البحرين', lat: 26.2285, lng: 50.5860, timezoneOffset: 3.0),
    CityData(name: 'مسقط', country: 'عُمان', lat: 23.5880, lng: 58.3829, timezoneOffset: 4.0),
    CityData(name: 'بغداد', country: 'العراق', lat: 33.3152, lng: 44.3661, timezoneOffset: 3.0),
    CityData(name: 'دمشق', country: 'سوريا', lat: 33.5138, lng: 36.2765, timezoneOffset: 3.0),
    CityData(name: 'بيروت', country: 'لبنان', lat: 33.8938, lng: 35.5018, timezoneOffset: 3.0),
    CityData(name: 'الرباط', country: 'المغرب', lat: 34.0209, lng: -6.8416, timezoneOffset: 1.0),
    CityData(name: 'الجزائر', country: 'الجزائر', lat: 36.7538, lng: 3.0588, timezoneOffset: 1.0),
    CityData(name: 'تونس', country: 'تونس', lat: 36.8065, lng: 10.1815, timezoneOffset: 1.0),
    CityData(name: 'إسطنبول', country: 'تركيا', lat: 41.0082, lng: 28.9784, timezoneOffset: 3.0),
  ];
}

class CityData {
  final String name;
  final String country;
  final double lat;
  final double lng;
  final double timezoneOffset;

  const CityData({
    required this.name,
    required this.country,
    required this.lat,
    required this.lng,
    required this.timezoneOffset,
  });
}
