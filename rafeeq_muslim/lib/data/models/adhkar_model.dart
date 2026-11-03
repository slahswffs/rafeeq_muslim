class DhikrItemModel {
  final String id;
  final String text;
  final int targetCount;
  final String? fadl;
  final String? reference;

  const DhikrItemModel({
    required this.id,
    required this.text,
    required this.targetCount,
    this.fadl,
    this.reference,
  });
}

class DhikrCategoryModel {
  final String id;
  final String title;
  final String iconKey;
  final String description;
  final List<DhikrItemModel> items;

  const DhikrCategoryModel({
    required this.id,
    required this.title,
    required this.iconKey,
    required this.description,
    required this.items,
  });
}
