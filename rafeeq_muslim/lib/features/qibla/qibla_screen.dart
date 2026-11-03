import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_compass/flutter_compass.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/widgets/app_card.dart';

class QiblaScreen extends ConsumerStatefulWidget {
  const QiblaScreen({super.key});

  @override
  ConsumerState<QiblaScreen> createState() => _QiblaScreenState();
}

class _QiblaScreenState extends ConsumerState<QiblaScreen> {
  final double _manualHeading = 0.0;

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final prayerService = ref.watch(prayerServiceProvider);

    final qiblaAngle = prayerService.calculateQiblaAngle(settings.latitude, settings.longitude);
    final distanceToKaaba = prayerService.calculateDistanceToKaaba(settings.latitude, settings.longitude);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('اتجاه القبلة', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Hero Info Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.primaryDark],
                ),
                borderRadius: BorderRadius.circular(AppRadius.card),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        settings.cityName,
                        style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'زاوية القبلة: ${qiblaAngle.round()}° من الشمال',
                        style: const TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                    ),
                    child: Text(
                      '$distanceToKaaba كم إلى مكة',
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Compass Dial Area (stream from FlutterCompass)
            AppCard(
              padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
              child: StreamBuilder<CompassEvent>(
                stream: FlutterCompass.events,
                builder: (context, snapshot) {
                  final hasSensor = snapshot.hasData && snapshot.data?.heading != null;
                  double heading = _manualHeading;
                  if (hasSensor) {
                    heading = snapshot.data!.heading!;
                  }

                  final needleRotation = (qiblaAngle - heading + 360) % 360;
                  final isAligned = hasSensor && ((needleRotation.abs() < 5) || ((needleRotation - 360).abs() < 5));

                  return Column(
                    children: [
                      SizedBox(
                        width: 240,
                        height: 240,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            // Outer rotating dial
                            Transform.rotate(
                              angle: -heading * (pi / 180),
                              child: Container(
                                width: 240,
                                height: 240,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Theme.of(context).brightness == Brightness.dark
                                      ? const Color(0xFF1E293B)
                                      : const Color(0xFFF8FAFC),
                                  border: Border.all(color: AppColors.border, width: 4),
                                ),
                                child: const Stack(
                                  children: [
                                    Align(
                                      alignment: Alignment.topCenter,
                                      child: Padding(
                                        padding: EdgeInsets.all(8.0),
                                        child: Text('ش (N)', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                                      ),
                                    ),
                                    Align(
                                      alignment: Alignment.bottomCenter,
                                      child: Padding(
                                        padding: EdgeInsets.all(8.0),
                                        child: Text('ج (S)', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                      ),
                                    ),
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: Padding(
                                        padding: EdgeInsets.all(8.0),
                                        child: Text('ق (E)', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                      ),
                                    ),
                                    Align(
                                      alignment: Alignment.centerLeft,
                                      child: Padding(
                                        padding: EdgeInsets.all(8.0),
                                        child: Text('غ (W)', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),

                            // Kaaba Pointer Needle
                            Transform.rotate(
                              angle: needleRotation * (pi / 180),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(
                                      color: Colors.amber.shade700,
                                      borderRadius: BorderRadius.circular(8),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.amber.withOpacity(0.4),
                                          blurRadius: 8,
                                        ),
                                      ],
                                    ),
                                    alignment: Alignment.center,
                                    child: const Text('🕋', style: TextStyle(fontSize: 16)),
                                  ),
                                  Container(
                                    width: 4,
                                    height: 60,
                                    color: Colors.amber.shade700,
                                  ),
                                  Container(
                                    width: 14,
                                    height: 14,
                                    decoration: const BoxDecoration(
                                      color: AppColors.primary,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      if (isAligned)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(AppRadius.pill),
                            border: Border.all(color: AppColors.success),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.check_circle, color: AppColors.success, size: 18),
                              SizedBox(width: 8),
                              Text('أنت تواجه اتجاه القبلة الآن بدقة', style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        )
                      else if (!hasSensor)
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.orange.shade50,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.orange.shade200),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.info_outline, color: Colors.orange.shade800, size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'مستشعر البوصلة غير متوفر على جهازك. اتجاه القبلة هو ${qiblaAngle.round()}° بالنسبة للشمال الجغرافي.',
                                  style: TextStyle(fontSize: 12, color: Colors.orange.shade900),
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        const Text(
                          'وجّه الهاتف بحيث يتطابق رمز الكعبة 🕋 مع السهم العلوي',
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
