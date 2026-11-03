class SurahModel {
  final int number;
  final String name;
  final String englishName;
  final int totalVerses;
  final String revelationType; // مكية / مدنية
  final int startPage;
  final int juz;

  const SurahModel({
    required this.number,
    required this.name,
    required this.englishName,
    required this.totalVerses,
    required this.revelationType,
    required this.startPage,
    required this.juz,
  });

  bool get isMeccan => revelationType == 'مكية';
}

class AyahModel {
  final int surahNumber;
  final int ayahNumber;
  final String text;
  final int page;
  final int juz;

  const AyahModel({
    required this.surahNumber,
    required this.ayahNumber,
    required this.text,
    required this.page,
    required this.juz,
  });
}

class QuranBookmark {
  final int surahNumber;
  final String surahName;
  final int ayahNumber;
  final String snippet;
  final DateTime timestamp;

  const QuranBookmark({
    required this.surahNumber,
    required this.surahName,
    required this.ayahNumber,
    required this.snippet,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'surahNumber': surahNumber,
    'surahName': surahName,
    'ayahNumber': ayahNumber,
    'snippet': snippet,
    'timestamp': timestamp.toIso8601String(),
  };

  factory QuranBookmark.fromJson(Map<String, dynamic> json) => QuranBookmark(
    surahNumber: json['surahNumber'] as int,
    surahName: json['surahName'] as String,
    ayahNumber: json['ayahNumber'] as int,
    snippet: json['snippet'] as String,
    timestamp: DateTime.parse(json['timestamp'] as String),
  );
}

class QuranLastReadPosition {
  final int surahNumber;
  final String surahName;
  final int ayahNumber;
  final int page;
  final int juz;
  final DateTime updatedAt;

  const QuranLastReadPosition({
    required this.surahNumber,
    required this.surahName,
    required this.ayahNumber,
    required this.page,
    required this.juz,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() => {
    'surahNumber': surahNumber,
    'surahName': surahName,
    'ayahNumber': ayahNumber,
    'page': page,
    'juz': juz,
    'updatedAt': updatedAt.toIso8601String(),
  };

  factory QuranLastReadPosition.fromJson(Map<String, dynamic> json) => QuranLastReadPosition(
    surahNumber: json['surahNumber'] as int,
    surahName: json['surahName'] as String,
    ayahNumber: json['ayahNumber'] as int,
    page: json['page'] as int,
    juz: json['juz'] as int,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );

  factory QuranLastReadPosition.initial() => QuranLastReadPosition(
    surahNumber: 2,
    surahName: 'البقرة',
    ayahNumber: 255,
    page: 42,
    juz: 3,
    updatedAt: DateTime.now(),
  );
}
