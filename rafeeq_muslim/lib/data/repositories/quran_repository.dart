import '../local/quran_data.dart';
import '../local/storage_service.dart';
import '../models/quran_model.dart';

class QuranRepository {
  final LocalStorageService _storageService;

  QuranRepository({required LocalStorageService storageService})
      : _storageService = storageService;

  List<SurahModel> getAllSurahs() {
    return QuranData.allSurahs;
  }

  Future<List<AyahModel>> getSurahVerses(int surahNumber) async {
    return await QuranData.getSurahVerses(surahNumber);
  }

  bool isSurahPreloaded(int surahNumber) {
    return QuranData.isSurahPreloaded(surahNumber);
  }

  Future<QuranLastReadPosition> getLastReadPosition() async {
    return await _storageService.getLastReadPosition();
  }

  Future<void> saveLastReadPosition(QuranLastReadPosition position) async {
    await _storageService.saveLastReadPosition(position);
  }

  Future<List<QuranBookmark>> getBookmarks() async {
    return await _storageService.getBookmarks();
  }

  Future<bool> toggleBookmark(QuranBookmark bookmark) async {
    final list = await _storageService.getBookmarks();
    final index = list.indexWhere((b) =>
        b.surahNumber == bookmark.surahNumber && b.ayahNumber == bookmark.ayahNumber);

    bool added;
    if (index >= 0) {
      list.removeAt(index);
      added = false;
    } else {
      list.insert(0, bookmark);
      added = true;
    }
    await _storageService.saveBookmarks(list);
    return added;
  }
}
