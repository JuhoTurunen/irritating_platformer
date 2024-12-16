# irritating_platformer
This game was one of the first web projects I built in 2021, and it does not properly display the quality of my current code.

Some functionalities, like progress saving, only work if the project runs on a server.

The project has a custom game engine. You can create new levels by duplicating an HTML page in levels/ and changing the matrix argument of setBoard(). Here are all the possible grid types:

- 0: Wall 
- 1: Air 
- 2: Spawn 
- 3: Goal 
- 4: Enemy path 
- 5: Y-Enemy 
- 6: X-Enemy 
- 9: Lava
