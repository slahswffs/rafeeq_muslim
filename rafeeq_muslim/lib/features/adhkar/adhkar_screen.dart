import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/widgets/app_card.dart';
import '../../data/models/adhkar_model.dart';

class AdhkarScreen extends ConsumerStatefulWidget {
  const AdhkarScreen({super.key});

  @override
  ConsumerState<AdhkarScreen> createState() => _AdhkarScreenState();
}

class _AdhkarScreenState extends ConsumerState<AdhkarScreen> {
  String _selectedCategoryId = 'morning';
  final Map<String, int> _counts = {};

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(adhkarRepositoryProvider);
    final categories = repo.getCategories();
    final activeCategory = categories.firstWhere(
      (c) => c.id == _selectedCategoryId,
      orElse: () => categories.first,
    );

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('الأذكار وحصن المسلم', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: Column(
          children: [
            // Categories Horizontal Slider
            Container(
              height: 52,
              margin: const EdgeInsets.symmetric(vertical: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final isSelected = cat.id == _selectedCategoryId;
                  return Padding(
                    padding: const EdgeInsets.only(left: 8),
                    child: ChoiceChip(
                      label: Text(cat.title),
                      selected: isSelected,
                      onSelected: (_) => setState(() => _selectedCategoryId = cat.id),
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
                    ),
                  );
                },
              ),
            ),

            // Active Category Header Banner
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                          activeCategory.title,
                          style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          activeCategory.description,
                          style: const TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                      ],
                    ),
                    const Icon(Icons.favorite, color: Colors.white, size: 24),
                  ],
                ),
              ),
            ),

            // Dhikr Items List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: activeCategory.items.length,
                itemBuilder: (context, index) {
                  final item = activeCategory.items[index];
                  final count = _counts[item.id] ?? 0;
                  final isCompleted = count >= item.targetCount;

                  return AppCard(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade100,
                                borderRadius: BorderRadius.circular(AppRadius.pill),
                              ),
                              child: Text(
                                item.reference ?? 'مأثور',
                                style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                              ),
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.copy, size: 16, color: AppColors.textSecondary),
                                  onPressed: () {
                                    Clipboard.setData(ClipboardData(text: item.text));
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('تم نسخ الذكر'), duration: Duration(seconds: 1)),
                                    );
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.share, size: 16, color: AppColors.textSecondary),
                                  onPressed: () {
                                    Share.share('${item.text}\n— تطبيق رفيق المسلم');
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          item.text,
                          textAlign: TextAlign.right,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            height: 1.8,
                          ),
                        ),
                        if (item.fadl != null) ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.06),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'الفضل: ${item.fadl}',
                              style: const TextStyle(fontSize: 11, color: AppColors.primary),
                            ),
                          ),
                        ],
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Text(
                                  '$count',
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                                Text(
                                  ' / ${item.targetCount}',
                                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                if (count > 0)
                                  IconButton(
                                    icon: const Icon(Icons.refresh, size: 18, color: AppColors.textSecondary),
                                    onPressed: () {
                                      HapticFeedback.lightImpact();
                                      setState(() => _counts[item.id] = 0);
                                    },
                                  ),
                                ElevatedButton(
                                  onPressed: isCompleted
                                      ? null
                                      : () {
                                          HapticFeedback.lightImpact();
                                          setState(() {
                                            _counts[item.id] = count + 1;
                                            if (_counts[item.id] == item.targetCount) {
                                              HapticFeedback.heavyImpact();
                                            }
                                          });
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: isCompleted ? AppColors.success : AppColors.primary,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(AppRadius.button),
                                    ),
                                  ),
                                  child: Text(
                                    isCompleted ? '✓ اكتمل الذكر' : 'تسبيح',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
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
