import 'package:flutter/material.dart';

class MapPlaceholder extends StatelessWidget {
  final String title;

  const MapPlaceholder({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 240,
      decoration: BoxDecoration(
        color: const Color(0xFFDCE0E8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(
        child: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            color: Color(0xFF4C4F69),
          ),
        ),
      ),
    );
  }
}
