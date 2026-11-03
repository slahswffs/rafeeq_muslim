import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/services/hijri_service.dart';
import '../../core/widgets/app_card.dart';
import '../../core/widgets/weekly_progress_card.dart';
import '../../data/models/prayer_model.dart';
import '../achievements/achievements_screen.dart';
import '../adhkar/adhkar_screen.dart';
import '../daily/daily_challenge_screen.dart';
import '../prayer/prayer_times_screen.dart';
import '../qibla/qibla_screen.dart';
import '../quran/quran_reader_screen.dart';
import '../tasbeeh/tasbeeh_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _activeTabIndex = 0; // 0: وردي اليومي, 1: يومي مع الله
  Timer? _countdownTimer;
  Duration _remainingTime = Duration.zero;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _updateRemainingTime();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) {
        _updateRemainingTime();
      }
    });
  }

  void _updateRemainingTime() {
    final nextPrayer = ref.read(nextPrayerProvider);
    final settings = ref.read(settingsProvider);
    final cityNow = DateTime.now().toUtc().add(Duration(minutes: (settings.timezoneOffset * 60).round()));
    final diff = nextPrayer.time.difference(cityNow);
    setState(() {
      _remainingTime = diff.isNegative ? Duration.zero : diff;
    });
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final prayers = ref.watch(prayerTimesProvider);
    final nextPrayer = ref.watch(nextPrayerProvider);
    final todayRecordAsync = ref.watch(todayPrayerRecordProvider);
    final weeklyCountsAsync = ref.watch(pastWeekPrayerCountsProvider);
    final lastRead = ref.watch(quranLastReadProvider);
    final quranRepo = ref.watch(quranRepositoryProvider);
    final prayerService = ref.watch(prayerServiceProvider);

    final hijri = HijriService.getHijriDate(
      date: DateTime.now(),
      adjustmentDays: settings.hijriDayAdjustment,
    );

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.nightlight_round, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'رفيق المسلم',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${settings.cityName} · ${hijri.formattedText}',
                  style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.explore_outlined, color: AppColors.primary),
            tooltip: 'القبلة',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const QiblaScreen()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.emoji_events_outlined, color: Color(0xFFF59E0B)),
            tooltip: 'الإنجازات',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const AchievementsScreen()));
            },
          ),
        ],
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Tabs: وردي اليومي / يومي مع الله
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => setState(() => _activeTabIndex = 0),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _activeTabIndex == 0 ? AppColors.primary : Colors.white,
                      foregroundColor: _activeTabIndex == 0 ? Colors.white : AppColors.textSecondary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.button),
                        side: const BorderSide(color: AppColors.border),
                      ),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('وردي اليومي', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const DailyChallengeScreen()));
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _activeTabIndex == 1 ? AppColors.primary : Colors.white,
                      foregroundColor: _activeTabIndex == 1 ? Colors.white : AppColors.textSecondary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppRadius.button),
                        side: const BorderSide(color: AppColors.border),
                      ),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: const Text('يومي مع الله', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Next Prayer Quick Banner with Live Countdown
            AppCard(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PrayerTimesScreen()));
              },
              backgroundColor: AppColors.primary.withOpacity(0.06),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.access_time, color: Colors.white, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'الصلاة القادمة: صلاة ${nextPrayer.arabicName}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          Text(
                            'الساعة ${nextPrayer.formattedTime} · متبقي: ${prayerService.formatRemainingDuration(_remainingTime)}',
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: const Text(
                      'المواقيت',
                      style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Quick Access Grid: القرآن، الأذكار، المسبحة، القبلة
            Row(
              children: [
                _buildQuickAction(
                  context: context,
                  title: 'القرآن',
                  icon: Icons.menu_book,
                  color: const Color(0xFF2563EB),
                  onTap: () {
                    final surah = quranRepo.getAllSurahs().firstWhere(
                      (s) => s.number == lastRead.surahNumber,
                      orElse: () => quranRepo.getAllSurahs().first,
                    );
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => QuranReaderScreen(surah: surah, initialAyah: lastRead.ayahNumber),
                      ),
                    );
                  },
                ),
                const SizedBox(width: 8),
                _buildQuickAction(
                  context: context,
                  title: 'الأذكار',
                  icon: Icons.favorite_border,
                  color: const Color(0xFF10B981),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const AdhkarScreen()));
                  },
                ),
                const SizedBox(width: 8),
                _buildQuickAction(
                  context: context,
                  title: 'السبحة',
                  icon: Icons.motion_photos_on_outlined,
                  color: const Color(0xFFF59E0B),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const TasbeehScreen()));
                  },
                ),
                const SizedBox(width: 8),
                _buildQuickAction(
                  context: context,
                  title: 'القبلة',
                  icon: Icons.explore_outlined,
                  color: const Color(0xFF8B5CF6),
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const QiblaScreen()));
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Weekly Progress Card (Dynamic past 7 days)
            weeklyCountsAsync.when(
              data: (counts) => WeeklyProgressCard(
                dailyCompletedCounts: counts,
                onSelectDay: (index) {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const PrayerTimesScreen()));
                },
              ),
              loading: () => WeeklyProgressCard(
                dailyCompletedCounts: const [0, 0, 0, 0, 0, 0, 0],
                onSelectDay: (_) {},
              ),
              error: (_, __) => WeeklyProgressCard(
                dailyCompletedCounts: const [0, 0, 0, 0, 0, 0, 0],
                onSelectDay: (_) {},
              ),
            ),
            const SizedBox(height: 16),

            // Today's Prayers Card
            todayRecordAsync.when(
              data: (record) {
                final fivePrayers = prayers.where((p) => p.type != PrayerType.sunrise).toList();
                return AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.wb_sunny_outlined, color: AppColors.primary, size: 20),
                              const SizedBox(width: 8),
                              const Text('صلواتي اليوم', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(AppRadius.pill),
                                ),
                                child: Text(
                                  '${record.completedCount} من 5',
                                  style: const TextStyle(color: AppColors.primary, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const Text('سجّل صلاتك بلطف', style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                        ],
                      ),
                      const SizedBox(height: 14),
                      ...fivePrayers.map((prayer) {
                        final isCompleted = record.completedPrayers[prayer.type] ?? false;
                        final isNext = prayer.type == nextPrayer.type;

                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: isCompleted
                                ? AppColors.primary.withOpacity(0.06)
                                : isNext
                                    ? Colors.amber.withOpacity(0.08)
                                    : Colors.grey.shade50,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isCompleted
                                  ? AppColors.primary.withOpacity(0.3)
                                  : isNext
                                      ? Colors.amber.shade300
                                      : AppColors.border,
                            ),
                          ),
                          child: InkWell(
                            onTap: () {
                              ref.read(todayPrayerRecordProvider.notifier).toggle(prayer.type);
                            },
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(
                                        color: isCompleted ? AppColors.primary : Colors.white,
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: isCompleted ? AppColors.primary : Colors.grey.shade400,
                                          width: 2,
                                        ),
                                      ),
                                      child: isCompleted
                                          ? const Icon(Icons.check, size: 16, color: Colors.white)
                                          : null,
                                    ),
                                    const SizedBox(width: 12),
                                    Text(
                                      prayer.arabicName,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        decoration: isCompleted ? TextDecoration.lineThrough : null,
                                        color: isCompleted ? AppColors.textSecondary : null,
                                      ),
                                    ),
                                    if (isNext) ...[
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: Colors.amber.shade100,
                                          borderRadius: BorderRadius.circular(AppRadius.pill),
                                        ),
                                        child: Text(
                                          'القادمة',
                                          style: TextStyle(color: Colors.amber.shade900, fontSize: 9, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                                Text(
                                  prayer.formattedTime,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, fontFamily: 'monospace'),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (_, __) => const SizedBox(),
            ),
            const SizedBox(height: 16),

            // Quran Progress Card
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.menu_book, color: AppColors.primary, size: 20),
                          SizedBox(width: 8),
                          Text('القرآن الكريم', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Text('الجزء ${lastRead.juz}', style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'وردك اليومي — سورة ${lastRead.surahName}، الآية ${lastRead.ayahNumber}',
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    onPressed: () {
                      final surah = quranRepo.getAllSurahs().firstWhere(
                        (s) => s.number == lastRead.surahNumber,
                        orElse: () => quranRepo.getAllSurahs().first,
                      );
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => QuranReaderScreen(
                            surah: surah,
                            initialAyah: lastRead.ayahNumber,
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.button)),
                      minimumSize: const Size(double.infinity, 46),
                    ),
                    child: const Text('ابدأ القراءة', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadius.card),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(AppRadius.card),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              const SizedBox(height: 6),
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
