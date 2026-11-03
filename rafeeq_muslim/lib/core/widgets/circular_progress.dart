import 'dart:math';
import 'package:flutter/material.dart';
import '../../app/theme.dart';

class CircularProgressIndicatorWidget extends StatelessWidget {
  final double percentage; // 0 to 100
  final double size;
  final double strokeWidth;
  final Widget? centerChild;
  final Color? progressColor;

  const CircularProgressIndicatorWidget({
    super.key,
    required this.percentage,
    this.size = 140,
    this.strokeWidth = 10,
    this.centerChild,
    this.progressColor,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _CirclePainter(
              percentage: percentage,
              strokeWidth: strokeWidth,
              progressColor: progressColor ?? AppColors.primary,
              backgroundColor: Theme.of(context).brightness == Brightness.dark
                  ? const Color(0xFF1E293B)
                  : const Color(0xFFF1F5F9),
            ),
          ),
          if (centerChild != null) centerChild!,
        ],
      ),
    );
  }
}

class _CirclePainter extends CustomPainter {
  final double percentage;
  final double strokeWidth;
  final Color progressColor;
  final Color backgroundColor;

  _CirclePainter({
    required this.percentage,
    required this.strokeWidth,
    required this.progressColor,
    required this.backgroundColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    // Background track
    final bgPaint = Paint()
      ..color = backgroundColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(center, radius, bgPaint);

    // Foreground arc
    final sweepAngle = 2 * pi * (percentage.clamp(0, 100) / 100.0);
    final fgPaint = Paint()
      ..color = progressColor
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      sweepAngle,
      false,
      fgPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CirclePainter oldDelegate) {
    return oldDelegate.percentage != percentage;
  }
}
