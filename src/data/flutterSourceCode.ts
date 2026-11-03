// Complete Flutter + Dart Project Files (Clean Architecture + Riverpod + Material 3)

export interface FlutterCodeFile {
  path: string;
  language: string;
  description: string;
  code: string;
}

export const FLUTTER_PROJECT_FILES: FlutterCodeFile[] = [
  {
    path: 'pubspec.yaml',
    language: 'yaml',
    description: 'ملف التبعات وحزم المشروع (Flutter & Dependencies)',
    code: `name: rafiq_almuslim
description: "رفيق المسلم - تطبيق إسلامي متكامل بهوية بصرية حديثة"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  intl: ^0.19.0
  shared_preferences: ^2.2.3
  adhan: ^2.0.0-nullsafety.0
  geolocator: ^11.0.0
  flutter_compass: ^0.8.0
  flutter_local_notifications: ^17.1.2
  share_plus: ^9.0.0
  google_fonts: ^6.2.1
  lucide_icons: ^0.257.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/audio/
`,
  },
  {
    path: 'lib/main.dart',
    language: 'dart',
    description: 'نقطة انطلاق التطبيق مع إعدادات RTL والـ Theme و Riverpod',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app/theme.dart';
import 'features/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: RafiqAlMuslimApp(),
    ),
  );
}

class RafiqAlMuslimApp extends ConsumerWidget {
  const RafiqAlMuslimApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'رفيق المسلم',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar'),
      supportedLocales: const [
        Locale('ar', ''),
        Locale('en', ''),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const HomeScreen(),
    );
  }
}
`,
  },
  {
    path: 'lib/app/theme.dart',
    language: 'dart',
    description: 'نظام الألوان والـ Material 3 والـ BorderRadius المحددة',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color backgroundLight = Color(0xFFF5F7FB);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF172033);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color border = Color(0xFFDCE3EF);
  static const Color success = Color(0xFF22C55E);
  static const Color warning = Color(0xFFF59E0B);
  static const Color darkBackground = Color(0xFF0F172A);
  static const Color darkCard = Color(0xFF172033);
}

class AppRadius {
  static const double card = 22.0;
  static const double button = 16.0;
  static const double pill = 999.0;
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.backgroundLight,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        surface: AppColors.cardLight,
        brightness: Brightness.light,
      ),
      textTheme: GoogleFonts.cairoTextTheme(),
      cardTheme: CardTheme(
        color: AppColors.cardLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.card),
          side: const BorderSide(color: AppColors.border, width: 1),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.darkBackground,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        surface: AppColors.darkCard,
        brightness: Brightness.dark,
      ),
      textTheme: GoogleFonts.cairoTextTheme(ThemeData(brightness: Brightness.dark).textTheme),
      cardTheme: CardTheme(
        color: AppColors.darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.card),
          side: const BorderSide(color: Color(0xFF334155), width: 1),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/features/prayer/prayer_service.dart',
    language: 'dart',
    description: 'خدمة حساب مواقيت الصلاة عبر مكتبة Adhan الرسمية لدارت',
    code: `import 'package:adhan/adhan.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PrayerService {
  PrayerTimes calculatePrayers({
    required double latitude,
    required double longitude,
    required DateTime date,
    CalculationMethod method = CalculationMethod.umm_al_qura,
    Madhab madhab = Madhab.shafi,
  }) {
    final coordinates = Coordinates(latitude, longitude);
    final params = method.getParameters();
    params.madhab = madhab;
    return PrayerTimes(coordinates, DateComponents.from(date), params);
  }
}

final prayerServiceProvider = Provider<PrayerService>((ref) => PrayerService());
`,
  },
  {
    path: 'lib/core/widgets/weekly_progress_card.dart',
    language: 'dart',
    description: 'عنصر WeeklyProgressCard لعرض أعمدة إنجاز الأسبوع السبعة',
    code: `import 'package:flutter/material.dart';
import '../../app/theme.dart';

class WeeklyProgressCard extends StatelessWidget {
  final List<int> dailyCompletedCounts; // 7 counts for 7 days (0..5)
  final Function(int dayIndex) onSelectDay;

  const WeeklyProgressCard({
    super.key,
    required this.dailyCompletedCounts,
    required this.onSelectDay,
  });

  static const List<String> arabicDayLetters = ['ر', 'خ', 'ج', 'س', 'ح', 'ن', 'اليوم'];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(AppRadius.card),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'إنجاز الأسبوع',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'كل عمود = عدد صلوات اليوم',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppRadius.pill),
                ),
                child: const Text(
                  'سجل الصلاة',
                  style: TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(7, (index) {
              final count = index < dailyCompletedCounts.length ? dailyCompletedCounts[index] : 0;
              final fraction = count / 5.0;
              final isToday = index == 6;

              return InkWell(
                onTap: () => onSelectDay(index),
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  child: Column(
                    children: [
                      Text(
                        '$count/5',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: count == 5 ? AppColors.success : AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 24,
                        height: 96,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(AppRadius.pill),
                          border: Border.all(color: AppColors.border),
                        ),
                        alignment: Alignment.bottomCenter,
                        child: AnimatedFractionallySizedBox(
                          duration: const Duration(milliseconds: 400),
                          heightFactor: fraction.clamp(0.0, 1.0),
                          child: Container(
                            decoration: BoxDecoration(
                              color: count == 5 ? AppColors.success : AppColors.primary,
                              borderRadius: BorderRadius.circular(AppRadius.pill),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        arabicDayLetters[index],
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isToday ? FontWeight.bold : FontWeight.normal,
                          color: isToday ? AppColors.primary : AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/features/tasbeeh/tasbeeh_screen.dart',
    language: 'dart',
    description: 'واجهة السبحة الإلكترونية مع الزر الدائري الكبير والاهتزاز',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../app/theme.dart';

class TasbeehScreen extends StatefulWidget {
  const TasbeehScreen({super.key});

  @override
  State<TasbeehScreen> createState() => _TasbeehScreenState();
}

class _TasbeehScreenState extends State<TasbeehScreen> {
  int _counter = 0;
  int _target = 33;
  String _currentDhikr = 'سبحان الله وبحمده';

  void _increment() {
    HapticFeedback.lightImpact();
    setState(() {
      _counter++;
      if (_target > 0 && _counter % _target == 0) {
        HapticFeedback.heavyImpact();
      }
    });
  }

  void _reset() {
    HapticFeedback.mediumImpact();
    setState(() {
      _counter = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('السبحة الإلكترونية'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _reset,
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _currentDhikr,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              '$_counter',
              style: const TextStyle(fontSize: 64, fontWeight: FontWeight.w900, color: AppColors.primary),
            ),
            const SizedBox(height: 32),
            GestureDetector(
              onTap: _increment,
              child: Container(
                width: 180,
                height: 180,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, AppColors.primaryDark],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.35),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Text(
                  'سبّح',
                  style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
];
