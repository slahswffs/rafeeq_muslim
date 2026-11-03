import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/constants.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/services/location_service.dart';
import '../../core/widgets/app_card.dart';
import '../../data/models/settings_model.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isLocating = false;

  void _showCityPickerBottomSheet(BuildContext context, SettingsNotifier notifier) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: DraggableScrollableSheet(
            initialChildSize: 0.6,
            maxChildSize: 0.85,
            minChildSize: 0.4,
            expand: false,
            builder: (_, scrollController) {
              return Column(
                children: [
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 12),
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Text(
                      'اختر مدينتك لمواقيت الصلاة',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: AppConstants.presetCities.length,
                      itemBuilder: (context, index) {
                        final city = AppConstants.presetCities[index];
                        return ListTile(
                          title: Text(city.nameAr, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text(city.countryAr, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          trailing: Text('UTC +${city.timezoneOffset.toInt()}', style: const TextStyle(fontSize: 11, color: AppColors.primary)),
                          onTap: () {
                            notifier.updateCity(
                              cityName: city.nameAr,
                              countryName: city.countryAr,
                              lat: city.latitude,
                              lng: city.longitude,
                              timezoneOffset: city.timezoneOffset,
                            );
                            Navigator.pop(ctx);
                          },
                        );
                      },
                    ),
                  ),
                ],
              );
            },
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final notifier = ref.read(settingsProvider.notifier);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('الإعدادات', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Theme Section
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('المظهر والوضع اللوني', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildThemeButton('فاتح', AppThemeMode.light, settings.themeMode, notifier),
                      const SizedBox(width: 8),
                      _buildThemeButton('داكن', AppThemeMode.dark, settings.themeMode, notifier),
                      const SizedBox(width: 8),
                      _buildThemeButton('تلقائي', AppThemeMode.system, settings.themeMode, notifier),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Location & City Section
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('المدينة والموقع الجغرافي', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(settings.cityName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                          Text(settings.countryName, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ],
                      ),
                      Row(
                        children: [
                          OutlinedButton(
                            onPressed: () => _showCityPickerBottomSheet(context, notifier),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.primary,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            ),
                            child: const Text('تغيير المدينة'),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: _isLocating
                                ? null
                                : () async {
                                    setState(() => _isLocating = true);
                                    final pos = await LocationService().getCurrentLocation();
                                    setState(() => _isLocating = false);
                                    if (pos != null) {
                                      notifier.updateCity(
                                        cityName: 'موقعي الحالي (GPS)',
                                        countryName: 'محدد تلقائياً',
                                        lat: pos.latitude,
                                        lng: pos.longitude,
                                        timezoneOffset: DateTime.now().timeZoneOffset.inMinutes / 60.0,
                                      );
                                    } else {
                                      if (context.mounted) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(
                                            content: Text('تعذر تحديد الموقع الجغرافي، يرجى اختيار مدينتك يدوياً'),
                                          ),
                                        );
                                      }
                                    }
                                  },
                            icon: const Icon(Icons.my_location, size: 16),
                            label: Text(_isLocating ? 'جارٍ التحديد...' : 'GPS'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Prayer Calculation Method & Madhab
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('طريقة حساب مواقيت الصلاة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<PrayerCalcMethod>(
                    value: settings.calcMethod,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                    items: const [
                      DropdownMenuItem(value: PrayerCalcMethod.ummAlQura, child: Text('أم القرى (مكة المكرمة)')),
                      DropdownMenuItem(value: PrayerCalcMethod.mwl, child: Text('رابطة العالم الإسلامي')),
                      DropdownMenuItem(value: PrayerCalcMethod.egypt, child: Text('الهيئة المصرية العامة للمساحة')),
                      DropdownMenuItem(value: PrayerCalcMethod.isna, child: Text('أمريكا الشمالية (ISNA)')),
                      DropdownMenuItem(value: PrayerCalcMethod.karachi, child: Text('جامعة العلوم بكراتشي')),
                      DropdownMenuItem(value: PrayerCalcMethod.dubai, child: Text('دائرة الشؤون الإسلامية بدبي')),
                    ],
                    onChanged: (val) {
                      if (val != null) notifier.updateCalcMethod(val);
                    },
                  ),
                  const SizedBox(height: 14),
                  const Text('مذهب حساب وقت العصر', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('الجمهور (شافعي/مالكي/حنبلي)'),
                          selected: settings.asrMethod == AsrJuristicMethod.standard,
                          onSelected: (_) => notifier.updateAsrMethod(AsrJuristicMethod.standard),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('المذهب الحنفي'),
                          selected: settings.asrMethod == AsrJuristicMethod.hanafi,
                          onSelected: (_) => notifier.updateAsrMethod(AsrJuristicMethod.hanafi),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Notifications & Hijri Adjustment
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('تنبيهات وإشعارات الصلاة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('إشعار محلي عند دخول وقت كل صلاة', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    value: settings.notificationsEnabled,
                    activeColor: AppColors.primary,
                    onChanged: (val) => notifier.toggleNotifications(val),
                  ),
                  const Divider(),
                  const SizedBox(height: 6),
                  const Text('تعديل التقويم الهجري', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 4),
                  const Text('وفقاً لرؤية الهلال المحلية في بلدك', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<int>(
                    value: settings.hijriDayAdjustment,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    items: const [
                      DropdownMenuItem(value: -2, child: Text('-2 يوم')),
                      DropdownMenuItem(value: -1, child: Text('-1 يوم')),
                      DropdownMenuItem(value: 0, child: Text('0 (التاريخ الافتراضي)')),
                      DropdownMenuItem(value: 1, child: Text('+1 يوم')),
                      DropdownMenuItem(value: 2, child: Text('+2 يوم')),
                    ],
                    onChanged: (val) {
                      if (val != null) notifier.updateHijriAdjustment(val);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // About App
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.info_outline, color: AppColors.primary),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('رفيق المسلم', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          Text('الإصدار 1.0.0 · تطبيق إسلامي مجاني بالكامل لوجه الله', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'تطبيق إسلامي أصلي مبني بلغة Dart و Flutter ويعمل بدون الحاجة للاتصال بالإنترنت مع احترام كامل لخصوصية المستخدم وحفظ البيانات محلياً.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.6),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildThemeButton(String label, AppThemeMode mode, AppThemeMode current, SettingsNotifier notifier) {
    final isSelected = mode == current;
    return Expanded(
      child: ElevatedButton(
        onPressed: () => notifier.toggleTheme(mode),
        style: ElevatedButton.styleFrom(
          backgroundColor: isSelected ? AppColors.primary : Colors.grey.shade100,
          foregroundColor: isSelected ? Colors.white : AppColors.textPrimary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
        child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
      ),
    );
  }
}
