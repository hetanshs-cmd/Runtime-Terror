import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'National Dashboard',
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFEFF1F5),
        primaryColor: const Color(0xFF1E66F5),
      ),
      home: const HomeScreen(),
    );
  }
}
