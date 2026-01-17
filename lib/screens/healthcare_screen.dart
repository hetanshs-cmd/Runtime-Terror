import 'package:flutter/material.dart';
import '../widgets/stat_card.dart';
import '../widgets/map_placeholder.dart';

class HealthcareScreen extends StatelessWidget {
  const HealthcareScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Wrap(
            spacing: 16,
            runSpacing: 16,
            children: const [
              StatCard(title: "Total Users", value: "2.4M"),
              StatCard(title: "Hospitals", value: "18,420"),
              StatCard(title: "Active Alerts", value: "12"),
            ],
          ),
          const SizedBox(height: 24),
          const MapPlaceholder(title: "Hospital Locations"),
          const SizedBox(height: 24),
          Card(
            color: const Color(0xFFFED8D8),
            child: const ListTile(
              leading: Icon(Icons.warning, color: Color(0xFFD20F39)),
              title: Text("Heatwave Alert"),
              subtitle: Text("Extreme heat reported in selected region"),
            ),
          ),
        ],
      ),
    );
  }
}