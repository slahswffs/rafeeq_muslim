import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/main_navigation.dart';
import 'app/providers.dart';
import 'app/theme.dart';
import 'core/services/notification_service.dart';
import 'data/models/settings_model.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize notifications service
  await NotificationService().initialize();

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
    final settings = ref.watch(settingsProvider);

    ThemeMode currentThemeMode;
    switch (settings.themeMode) {
      case AppThemeMode.light:
        currentThemeMode = ThemeMode.light;
        break;
      case AppThemeMode.dark:
        currentThemeMode = ThemeMode.dark;
        break;
      case AppThemeMode.system:
        currentThemeMode = ThemeMode.system;
        break;
    }

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
      themeMode: currentThemeMode,
      home: const MainNavigationScreen(),
    );
  }
}
