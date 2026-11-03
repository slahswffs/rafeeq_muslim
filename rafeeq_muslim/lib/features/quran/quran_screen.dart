import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/widgets/app_card.dart';
import '../../data/models/quran_model.dart';
import 'quran_reader_screen.dart';

class QuranScreen extends ConsumerStatefulWidget {
  const QuranScreen({super.key});

  @override
  ConsumerState<QuranScreen> createState() => _QuranScreenState();
}

class _QuranScreenState extends ConsumerState<QuranScreen> {
  String _searchQuery = '';
  String _filter = 'all'; // all, meccan, medinan, bookmarks
  List<QuranBookmark> _bookmarks = [];
  bool _loadingBookmarks = false;

  @override
  void initState() {
    super.initState();
    _loadBookmarks();
  }

  Future<void> _loadBookmarks() async {
    setState(() => _loadingBookmarks = true);
    final repo = ref.read(quranRepositoryProvider);
    final list = await repo.getBookmarks();
    if (mounted) {
      setState(() {
        _bookmarks = list;
        _loadingBookmarks = false;
      });
    }
  }

  String _normalizeArabic(String text) {
    return text
        .trim()
        .toLowerCase()
        .replaceAll(RegExp(r'[أإآ]'), 'ا')
        .replaceAll('ة', 'ه')
        .replaceAll(RegExp(r'[\u064B-\u065F]'), '');
  }

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(quranRepositoryProvider);
    final lastRead = ref.watch(quranLastReadProvider);
    final allSurahs = repo.getAllSurahs();

    final filteredSurahs = allSurahs.where((s) {
      final normQ = _normalizeArabic(_searchQuery);
      final normName = _normalizeArabic(s.name);
      final withoutAl = normName.startsWith('ال') ? normName.substring(2) : normName;

      final matchesSearch = normName.contains(normQ) ||
          withoutAl.contains(normQ) ||
          s.englishName.toLowerCase().contains(_searchQuery.toLowerCase().trim()) ||
          s.number.toString() == _searchQuery.trim();

      if (!matchesSearch) return false;

      if (_filter == 'meccan') return s.isMeccan;
      if (_filter == 'medinan') return !s.isMeccan;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('القرآن الكريم', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Last Read Resume Card
            AppCard(
              backgroundColor: AppColors.primary,
              onTap: () async {
                final targetSurah = allSurahs.firstWhere(
                  (s) => s.number == lastRead.surahNumber,
                  orElse: () => allSurahs.first,
                );
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => QuranReaderScreen(
                      surah: targetSurah,
                      initialAyah: lastRead.ayahNumber,
                    ),
                  ),
                );
                _loadBookmarks();
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.bookmark, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'تابع من حيث توقفت',
                            style: TextStyle(color: Colors.white70, fontSize: 11),
                          ),
                          Text(
                            'سورة ${lastRead.surahName} · الآية ${lastRead.ayahNumber}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(AppRadius.pill),
                    ),
                    child: const Text(
                      'متابعة',
                      style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Search TextField
            TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'ابحث عن اسم السورة أو رقمها...',
                hintStyle: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
                prefixIcon: const Icon(Icons.search, color: AppColors.textSecondary),
                filled: true,
                fillColor: Theme.of(context).cardColor,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.button),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppRadius.button),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Filter Tabs (All, Meccan, Medinan, Bookmarks)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('all', 'جميع السور (114)'),
                  const SizedBox(width: 8),
                  _buildFilterChip('meccan', 'مكية'),
                  const SizedBox(width: 8),
                  _buildFilterChip('medinan', 'مدنية'),
                  const SizedBox(width: 8),
                  _buildFilterChip('bookmarks', 'المفضلة (${_bookmarks.length})'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // If Bookmarks tab is active
            if (_filter == 'bookmarks') ...[
              if (_loadingBookmarks)
                const Center(child: CircularProgressIndicator())
              else if (_bookmarks.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40),
                    child: Column(
                      children: const [
                        Icon(Icons.bookmark_border, size: 48, color: AppColors.textSecondary),
                        SizedBox(height: 12),
                        Text(
                          'لا توجد آيات في المفضلة بعد',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'يمكنك حفظ أي آية بالضغط على أيقونة الإشارة المرجعية داخل القارئ',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                )
              else
                ..._bookmarks.map((b) {
                  return AppCard(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      dense: true,
                      contentPadding: EdgeInsets.zero,
                      leading: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '${b.ayahNumber}',
                          style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      title: Text(
                        'سورة ${b.surahName} · الآية ${b.ayahNumber}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      subtitle: Text(
                        b.snippet,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline, size: 20, color: Colors.redAccent),
                        onPressed: () async {
                          await repo.toggleBookmark(b);
                          _loadBookmarks();
                        },
                      ),
                      onTap: () async {
                        final surah = allSurahs.firstWhere(
                          (s) => s.number == b.surahNumber,
                          orElse: () => allSurahs.first,
                        );
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => QuranReaderScreen(
                              surah: surah,
                              initialAyah: b.ayahNumber,
                            ),
                          ),
                        );
                        _loadBookmarks();
                      },
                    ),
                  );
                }),
            ] else ...[
              // Surahs List
              ...filteredSurahs.map((surah) {
                return AppCard(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  onTap: () async {
                    await Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => QuranReaderScreen(surah: surah),
                      ),
                    );
                    _loadBookmarks();
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '${surah.number}',
                              style: const TextStyle(
                                color: AppColors.primary,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'سورة ${surah.name}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              Text(
                                '${surah.englishName} · ${surah.totalVerses} آية · ${surah.revelationType}',
                                style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Text(
                            'الجزء ${surah.juz}',
                            style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.chevron_left, color: AppColors.textSecondary, size: 18),
                        ],
                      ),
                    ],
                  ),
                );
              }),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _filter == key;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _filter = key),
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textSecondary,
        fontSize: 11,
        fontWeight: FontWeight.bold,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppRadius.button),
        side: const BorderSide(color: AppColors.border),
      ),
    );
  }
}
