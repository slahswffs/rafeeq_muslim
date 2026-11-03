# Uthmanic Quran Dataset Directory
# مسار بيانات القرآن الكريم المعتمدة

لتحميل المصحف الشريف كاملاً (114 سورة):
يتم وضع ملفات السور بصيغة JSON داخل هذا المجلد بالمسار:
assets/data/quran/surah_{surahNumber}.json

مثال:
- surah_1.json
- surah_2.json
...
- surah_114.json

تنسيق السورة (JSON):
[
  {
    "numberInSurah": 1,
    "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "page": 1,
    "juz": 1
  }
]
