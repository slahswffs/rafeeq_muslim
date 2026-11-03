import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:share_plus/share_plus.dart';
import '../../app/providers.dart';
import '../../app/theme.dart';
import '../../core/widgets/app_card.dart';
import '../../data/models/quran_model.dart';

class QuranReaderScreen extends ConsumerStatefulWidget {
  final SurahModel surah;
  final int initialAyah;

  const QuranReaderScreen({
    super.key,
    required this.surah,
    this.initialAyah = 1,
  });

  @override
  ConsumerState<QuranReaderScreen> createState() => _QuranReaderScreenState();
}

class _QuranReaderScreenState extends ConsumerState<QuranReaderScreen> {
  double _fontSize = 22.0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(quranLastReadProvider.notifier).setPosition(
            QuranLastReadPosition(
              surahNumber: widget.surah.number,
              surahName: widget.surah.name,
              ayahNumber: widget.initialAyah,
              page: widget.surah.startPage,
              juz: widget.surah.juz,
              updatedAt: DateTime.now(),
            ),
          );
    });
  }

  @override
  Widget build(BuildContext context) {
    final repo = ref.watch(quranRepositoryProvider);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Column(
          children: [
            Text('سورة ${widget.surah.name}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(
              '${widget.surah.revelationType} · ${widget.surah.totalVerses} آية · الجزء ${widget.surah.juz}',
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.text_fields),
            tooltip: 'تغيير حجم الخط',
            onPressed: () {
              setState(() {
                if (_fontSize >= 28) {
                  _fontSize = 18;
                } else {
                  _fontSize += 4;
                }
              });
            },
          ),
        ],
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: FutureBuilder<List<AyahModel>>(
          future: repo.getSurahVerses(widget.surah.number),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            final verses = snapshot.data ?? [];

            if (verses.isEmpty) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: AppCard(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.info_outline, color: AppColors.primary, size: 40),
                        const SizedBox(height: 16),
                        Text(
                          'سورة ${widget.surah.name}',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'البنية البرمجية جاهزة لقراءة الآيات بدقة، وتتطلب إدراج ملف المصحف المعتمد (Uthmanic Quran Dataset) في مسار: assets/data/quran/\n\nتم الالتزام التام بعدم اختراع أو توليد أي نصوص غير موثقة حفاظاً على قدسية وصحة كلام الله تعالى.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.6),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(AppRadius.pill),
                          ),
                          child: Text(
                            'السور المدمجة مسبقاً بنصها الكامل: الفاتحة، القدر، العصر، الفيل، قريش، الماعون، الكوثر، الكافرون، النصر، المسد، الإخلاص، الفلق، الناس',
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }

            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Bismillah Header (except for Surah At-Tawbah 9)
                if (widget.surah.number != 9)
                  Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor,
                      borderRadius: BorderRadius.circular(AppRadius.card),
                      border: Border.all(color: AppColors.border),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                      style: GoogleFonts.amiri(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ),

                // Verses List
                ...verses.map((ayah) {
                  return AppCard(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          '${ayah.text} ۝ (${ayah.ayahNumber})',
                          textAlign: TextAlign.right,
                          style: GoogleFonts.amiri(
                            fontSize: _fontSize,
                            height: 2.2,
                            color: Theme.of(context).brightness == Brightness.dark
                                ? Colors.white
                                : AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Divider(color: Colors.grey.withOpacity(0.15)),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'آية ${ayah.ayahNumber} · ص ${ayah.page}',
                              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                            ),
                            Row(
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.bookmark_border, size: 18),
                                  onPressed: () async {
                                    final bookmark = QuranBookmark(
                                      surahNumber: widget.surah.number,
                                      surahName: widget.surah.name,
                                      ayahNumber: ayah.ayahNumber,
                                      snippet: ayah.text.length > 50
                                          ? '${ayah.text.substring(0, 50)}...'
                                          : ayah.text,
                                      timestamp: DateTime.now(),
                                    );
                                    final added = await repo.toggleBookmark(bookmark);
                                    if (context.mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text(added ? 'تمت الإضافة إلى المفضلة' : 'تم الحذف من المفضلة'),
                                          duration: const Duration(seconds: 1),
                                        ),
                                      );
                                    }
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.copy, size: 18),
                                  onPressed: () {
                                    Clipboard.setData(ClipboardData(
                                      text: '﴿${ayah.text}﴾ [سورة ${widget.surah.name} : ${ayah.ayahNumber}]',
                                    ));
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('تم نسخ الآية'), duration: Duration(seconds: 1)),
                                    );
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.share, size: 18),
                                  onPressed: () {
                                    Share.share(
                                      '﴿${ayah.text}﴾ [سورة ${widget.surah.name} : ${ayah.ayahNumber}]\n— تطبيق رفيق المسلم',
                                    );
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
            );
          },
        ),
      ),
    );
  }
}
