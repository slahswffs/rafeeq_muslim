class AchievementModel {
  final String id;
  final String title;
  final String description;
  final String iconKey;
  final int maxProgress;
  final int currentProgress;
  final bool isUnlocked;

  const AchievementModel({
    required this.id,
    required this.title,
    required this.description,
    required this.iconKey,
    required this.maxProgress,
    this.currentProgress = 0,
    this.isUnlocked = false,
  });

  AchievementModel copyWith({
    int? currentProgress,
    bool? isUnlocked,
  }) {
    return AchievementModel(
      id: id,
      title: title,
      description: description,
      iconKey: iconKey,
      maxProgress: maxProgress,
      currentProgress: currentProgress ?? this.currentProgress,
      isUnlocked: isUnlocked ?? this.isUnlocked,
    );
  }
}
