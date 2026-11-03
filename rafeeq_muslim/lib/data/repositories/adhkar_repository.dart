import '../local/adhkar_data.dart';
import '../local/storage_service.dart';
import '../models/adhkar_model.dart';

class AdhkarRepository {
  final LocalStorageService _storageService;

  AdhkarRepository({required LocalStorageService storageService})
      : _storageService = storageService;

  List<DhikrCategoryModel> getCategories() {
    return AdhkarData.categories;
  }

  Future<int> getItemCount(String dateStr, String itemId) async {
    return await _storageService.getAdhkarItemCount(dateStr, itemId);
  }

  Future<void> setItemCount(String dateStr, String itemId, int count) async {
    await _storageService.saveAdhkarItemCount(dateStr, itemId, count);
  }
}
