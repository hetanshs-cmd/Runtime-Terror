import 'package:flutter/material.dart';
import 'healthcare_screen.dart';
import 'agriculture_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {

    final screenSize = MediaQuery.of(context).size;
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFFEFF1F5),
          elevation: 0,
          title: const Text(
            "National Services Portal",
            style: TextStyle(
              color: Color(0xFF4C4F69),
              fontWeight: FontWeight.bold,
            ),
          ),
          bottom: const TabBar(
            labelColor: Color(0xFF1E66F5),
            unselectedLabelColor: Color(0xFF6C6F85),
            indicatorColor: Color(0xFF1E66F5),
            tabs: [
              Tab(text: "Healthcare"),
              Tab(text: "Agriculture"),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            HealthcareScreen(),
            AgricultureScreen(),
          ],
        ),
      ),
    );
  }
}
