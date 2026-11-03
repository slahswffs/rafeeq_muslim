import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/widgets/app_card.dart';
import '../../core/widgets/circular_progress.dart';

class DailyChallengeScreen extends ConsumerStatefulWidget {
  const DailyChallengeScreen({super.key});

  @override
  ConsumerState<DailyChallengeScreen> createState() => _DailyChallengeScreenState();
}

class _DailyChallengeScreenState extends ConsumerState<DailyChallengeScreen> {
  bool _quranDone = false;
  bool _morningDone = false;
  bool _eveningDone = false;
  bool _sadaqahDone = false;
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadDailyChecklist();
  }

  Future<void> _loadDailyChecklist() async {
    final storage = ref.read(localStorageServiceProvider);
    final dateStr = getTodayDateString();
    final checklist = await storage.getDailyChecklist(dateStr);
    if (mounted) {
      setState(() {
        _quranDone = checklist['quran'] ?? false;
        _morningDone = checklist['morning'] ?? false;
        _eveningDone = checklist['evening'] ?? false;
        _sadaqahDone = checklist['sadaqah'] ?? false;
        _isLoaded = true;
      });
    }
  }

  Future<void> _updateChecklist(String key, bool value) async {
    final storage = ref.read(localStorageServiceProvider);
    final dateStr = getTodayDateString();
    setState(() {
      if (key == 'quran') _quranDone = value;
      if (key == 'morning') _morningDone = value;
      if (key == 'evening') _eveningDone = value;
      if (key == 'sadaqah') _sadaqahDone = value;
    });
    final checklist = {
      'quran': _quranDone,
      'morning': _morningDone,
      'evening': _eveningDone,
      'sadaqah': _sadaqahDone,
    };
    await storage.saveDailyChecklist(dateStr, checklist);
  }

  @override
  Widget build(BuildContext context) {
    final todayRecordAsync = ref.watch(todayPrayerRecordProvider);
    final tasbeehState = ref.watch(tasbeehProvider);

    int prayersCompleted = 0;
    todayRecordAsync.whenData((rec) => prayersCompleted = rec.completedCount);

    final isTasbeehDone = tasbeehState.count >= 100;

    // Calculate score
    double score = (prayersCompleted / 5.0) * 40.0;
    if (_quranDone) score += 20.0;
    if (_morningDone) score += 10.0;
    if (_eveningDone) score += 10.0;
    if (isTasbeehDone) score += 10.0;
    if (_sadaqahDone) score += 10.0;

    final totalPercent = score.clamp(0.0, 100.0);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('يومي مع الله', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Circular Progress Hero Card
            AppCard(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: [
                  CircularProgressIndicatorWidget(
                    percentage: totalPercent,
                    size: 150,
                    strokeWidth: 12,
                    centerChild: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '${totalPercent.round()}%',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'monospace',
                          ),
                        ),
                        const Text(
                          'إنجاز اليوم',
                          style: TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    totalPercent >= 100
                        ? 'مبارك! أتممت جميع أورادك اليوم 🌟'
                        : totalPercent >= 60
                            ? 'إنجاز إيماني مبارك، واصل الطاعة'
                            : 'بداية مباركة، بارك الله في وقتك ووردك',
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    '"أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ"',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Daily Habits Checklist
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('قائمة الطاعات والأوراد اليومية', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  _buildHabitItem(
                    title: 'الصلوات المفروضة',
                    subtitle: 'سجلت $prayersCompleted من 5 صلوات',
                    isDone: prayersCompleted == 5,
                    onTap: null,
                    trailing: Text('$prayersCompleted/5', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  _buildHabitItem(
                    title: 'ورد القرآن الكريم',
                    subtitle: 'تلاوة جزء أو حزب من كتاب الله',
                    isDone: _quranDone,
                    onTap: () => _updateChecklist('quran', !_quranDone),
                  ),
                  _buildHabitItem(
                    title: 'أذكار الصباح',
                    subtitle: 'حصنك الإيماني الصباحي',
                    isDone: _morningDone,
                    onTap: () => _updateChecklist('morning', !_morningDone),
                  ),
                  _buildHabitItem(
                    title: 'أذكار المساء',
                    subtitle: 'حفظ وسكينة المساء',
                    isDone: _eveningDone,
                    onTap: () => _updateChecklist('evening', !_eveningDone),
                  ),
                  _buildHabitItem(
                    title: 'التسبيح اليومي (100)',
                    subtitle: 'الحالي: ${tasbeehState.count} تسبيحة',
                    isDone: isTasbeehDone,
                    onTap: null,
                  ),
                  _buildHabitItem(
                    title: 'صدقة أو إحسان اليوم',
                    subtitle: 'مال أو كلمة طيبة أو ابتسامة صدقة',
                    isDone: _sadaqahDone,
                    onTap: () => _updateChecklist('sadaqah', !_sadaqahDone),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHabitItem({
    required String title,
    required String subtitle,
    required bool isDone,
    VoidCallback? onTap,
    Widget? trailing,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isDone ? AppColors.primary.withOpacity(0.06) : Colors.grey.shade50,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDone ? AppColors.primary.withOpacity(0.3) : AppColors.border,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: isDone ? AppColors.primary : Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isDone ? AppColors.primary : Colors.grey.shade400,
                      width: 2,
                    ),
                  ),
                  child: isDone
                      ? const Icon(Icons.check, size: 16, color: Colors.white)
                      : null,
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(subtitle, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                  ],
                ),
              ],
            ),
            if (trailing != null) trailing,
          ],
        ),
      ),
    );
  }
}
