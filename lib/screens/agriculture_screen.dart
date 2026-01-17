import 'package:flutter/material.dart';
import '../widgets/stat_card.dart';
import '../widgets/map_placeholder.dart';

class AgricultureScreen extends StatelessWidget {
  const AgricultureScreen({super.key});

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
              StatCard(title: "Total Farmers", value: "9.8M"),
              StatCard(title: "Season Crop", value: "Wheat"),
              StatCard(title: "Avg Temp", value: "27°C"),
            ],
          ),
          const SizedBox(height: 24),
          const MapPlaceholder(title: "Weather & Crop Regions"),
          const SizedBox(height: 24),
          Card(
            color: const Color(0xFFE1F0DA),
            child: const ListTile(
              leading: Icon(Icons.cloud, color: Color(0xFF40A02B)),
              title: Text("Weather Forecast"),
              subtitle: Text("Rain expected in 3 days • Humidity 60%"),
            ),
          ),
        ],
      ),
    );
  }
}
