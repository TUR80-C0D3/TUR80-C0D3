
function move(x,y,i)
{
	if(objects[playerIndex+i].mode == 1)
	{
		if(
			objects[playerIndex+i*2].mode != 0 &&
			objects[playerIndex+i*2].mode != 1	
		){
			let now = objects[playerIndex+i*2];

			objects[playerIndex+i*2] = objects[playerIndex+i];
			objects[playerIndex+i] = objects[playerIndex+i].underlaying;
			objects[playerIndex+i*2].underlaying = now;

			objects[playerIndex+i*2].x += x*TileSize;
			objects[playerIndex+i*2].y += y*TileSize;

			if(objects[playerIndex+i*2].underlaying.mode == 2){
				if(
					objects[playerIndex+i] == 0
				){
					placedCrates++;
				}
			}
			
			if(
				objects[playerIndex+i].underlaying == 0 &&
				objects[playerIndex+i*2].underlaying.mode != 2
			){
				placedCrates--;
			}
		}
	}

	if(
		objects[playerIndex+x].mode != 0 &&
		objects[playerIndex+x].mode != 1
	){
		player.x += x*TileSize;
		playerIndex += x;
		if(x != 0){
			movesLeft--;
		}
	}

	if(
		objects[playerIndex+y*map.width].mode != 0 &&
		objects[playerIndex+y*map.width].mode != 1
	){
		player.y += y*TileSize;
		playerIndex += y*map.width;
		if(y != 0){
			movesLeft--;
		}
	}
}

function control()
{
	if(movesLeft > 0){
		if(Phaser.Input.Keyboard.JustDown(keyDown[0])){
			move(1, 0, 1);
		}
		
		if(Phaser.Input.Keyboard.JustDown(keyDown[1])){
			move(-1,0,-1);
		}

		if(Phaser.Input.Keyboard.JustDown(keyDown[2])){
			move(0, -1, -map.width);
		}
			
		if(Phaser.Input.Keyboard.JustDown(keyDown[3])){
			move(0, 1, map.width);
		}
	}
}