import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/widgets/app_card.dart';

class TasbeehScreen extends ConsumerStatefulWidget {
  const TasbeehScreen({super.key});

  @override
  ConsumerState<TasbeehScreen> createState() => _TasbeehScreenState();
}

class _TasbeehScreenState extends ConsumerState<TasbeehScreen> {
  static const List<String> presetDhikrList = [
    'سبحان الله وبحمده',
    'سُبْحَانَ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'اللَّهُ أَكْبَرُ',
    'لَا إِلَهَ إِلَّا اللَّهُ',
    'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِهِ',
    'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
  ];

  void _showCustomTargetDialog(BuildContext context, TasbeehNotifier notifier) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => Directionality(
        textDirection: TextDirection.rtl,
        child: AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppRadius.card)),
          title: const Text('تحديد هدف تسبيح مخصص', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          content: TextField(
            controller: controller,
            keyboardType: TextInputType.number,
            autofocus: true,
            decoration: InputDecoration(
              hintText: 'أدخل العدد المطلوب (مثال: 70 أو 500)',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('إلغاء'),
            ),
            ElevatedButton(
              onPressed: () {
                final val = int.tryParse(controller.text.trim());
                if (val != null && val > 0) {
                  notifier.setTarget(val);
                }
                Navigator.pop(ctx);
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white),
              child: const Text('تأكيد'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tasbeeh = ref.watch(tasbeehProvider);
    final notifier = ref.read(tasbeehProvider.notifier);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('السبحة الإلكترونية', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'تصفير العداد',
            onPressed: () {
              HapticFeedback.mediumImpact();
              notifier.reset();
            },
          ),
        ],
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Target selector chips: 33, 100, Free, Custom Target
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildTargetChip(33, tasbeeh.target, notifier),
                  const SizedBox(width: 8),
                  _buildTargetChip(100, tasbeeh.target, notifier),
                  const SizedBox(width: 8),
                  _buildTargetChip(0, tasbeeh.target, notifier, customLabel: 'حر'),
                  const SizedBox(width: 8),
                  ActionChip(
                    avatar: const Icon(Icons.tune, size: 16, color: AppColors.primary),
                    label: Text(
                      (tasbeeh.target != 33 && tasbeeh.target != 100 && tasbeeh.target != 0)
                          ? 'مخصص (${tasbeeh.target})'
                          : 'هدف مخصص',
                    ),
                    onPressed: () => _showCustomTargetDialog(context, notifier),
                    backgroundColor: (tasbeeh.target != 33 && tasbeeh.target != 100 && tasbeeh.target != 0)
                        ? AppColors.primary.withOpacity(0.12)
                        : Colors.white,
                    labelStyle: TextStyle(
                      color: (tasbeeh.target != 33 && tasbeeh.target != 100 && tasbeeh.target != 0)
                          ? AppColors.primary
                          : AppColors.textSecondary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadius.button),
                      side: BorderSide(
                        color: (tasbeeh.target != 33 && tasbeeh.target != 100 && tasbeeh.target != 0)
                            ? AppColors.primary
                            : AppColors.border,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Main Tasbeeh Tap Card
            AppCard(
              padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 16),
              child: Column(
                children: [
                  Text(
                    tasbeeh.dhikr,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '${tasbeeh.count}',
                    style: const TextStyle(
                      fontSize: 64,
                      fontWeight: FontWeight.w900,
                      color: AppColors.primary,
                      fontFamily: 'monospace',
                    ),
                  ),
                  if (tasbeeh.target > 0)
                    Text(
                      'الهدف: ${tasbeeh.target} · الدورة: ${(tasbeeh.count ~/ tasbeeh.target) + 1}',
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  const SizedBox(height: 36),

                  // Giant Circular Button
                  GestureDetector(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      notifier.increment();
                      if (tasbeeh.target > 0 && (tasbeeh.count + 1) % tasbeeh.target == 0) {
                        HapticFeedback.heavyImpact();
                      }
                    },
                    child: Container(
                      width: 180,
                      height: 180,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: const LinearGradient(
                          colors: [AppColors.primary, AppColors.primaryDark],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.35),
                            blurRadius: 24,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'سبّح',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'انقر للتسبيح',
                            style: TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.stars, color: Colors.amber, size: 18),
                      const SizedBox(width: 6),
                      Text(
                        'إجمالي التسبيحات الكلي: ${tasbeeh.totalLifetime}',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Select Dhikr Preset Card
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('اختر صيغة الذكر', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 12),
                  ...presetDhikrList.map((d) {
                    final isSelected = tasbeeh.dhikr == d;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary.withOpacity(0.08) : Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppColors.primary : AppColors.border,
                        ),
                      ),
                      child: ListTile(
                        dense: true,
                        title: Text(
                          d,
                          style: TextStyle(
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            color: isSelected ? AppColors.primary : null,
                            fontSize: 13,
                          ),
                        ),
                        trailing: isSelected ? const Icon(Icons.check, color: AppColors.primary, size: 18) : null,
                        onTap: () {
                          HapticFeedback.lightImpact();
                          notifier.setDhikr(d);
                        },
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTargetChip(int target, int currentTarget, TasbeehNotifier notifier, {String? customLabel}) {
    final isSelected = target == currentTarget;
    return ChoiceChip(
      label: Text(customLabel ?? '$target'),
      selected: isSelected,
      onSelected: (_) => notifier.setTarget(target),
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textSecondary,
        fontWeight: FontWeight.bold,
        fontSize: 12,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.button),
        side: const BorderSide(color: AppColors.border),
      ),
    );
  }
}
