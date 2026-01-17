import "package:flutter/material.dart";



class SuperUser extends StatefulWidget{
  const SuperUser({super.key});

  @override
  State<StatefulWidget> createState() => _SuperUser();
}

class _SuperUser extends State<SuperUser>{


  @override
  Widget build(BuildContext context) {

    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        height: screenSize.height,
        width: double.infinity,

        child: Column(
          children: [
            Row(children: [
              Card(
                color: const Color(0xFF1c1c1E),
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              )
            ],
            )
          ],
        ),

      ),
    );
  }

}

