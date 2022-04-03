
function reset()
{
	objects = [];
	camera = 0;
	player = 0;
	playerIndex = 0;
	textures = 0;
	block = 0;
	map = 0;
	
	targets = 0;
	placedCrates = 0;
	score = 0;
	movesText = 0;
	movesLeft = 0;
	levelData = 0;
	keyDown = [];
	buttons = [];
};

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function setup()
    {
        Phaser.Scene.call(this, { key: 'GameScene', active: false });

        this.frames;
    },

    preload: function ()
    {
		reset();
	
		this.load.image('wall', 'assets/wall1.png');
		this.load.image('crate', 'assets/crate1.png');
		this.load.image('target', 'assets/target.png');
	
		this.load.image('bg1', 'assets/ground.png');
	
		this.load.image('player', 'assets/player/player.png');
	
		for(let i=0; i<levels; i++){
			this.load.image('map'+String(i), 'levels/'+String(i)+'.bmp');
		}
		this.load.json('levelData', 'levels/data.json');
	},

    create: function ()
    {
		
		reset();

		let tile;
		levelData = this.cache.json.get('levelData');
		zoom = levelData.zoom[level];
		movesLeft = levelData.moves[level];

		map = this.add.sprite( 0, 0, 'map'+String(level) );
		map.visible = false;

		camera = this.cameras.main;
		camera.setZoom(zoom);
		camera.centerOn(map.width*TileSize/2, map.height*TileSize/2);

		this.add.tileSprite(
			map.width*TileSize/2,
			map.height*TileSize/2,
			Game.config.width/zoom,
			Game.config.height/zoom,
			"bg1"
		).setTint(Phaser.Display.Color.GetColor(205, 205, 205));
		
		let rgba,px,py;
		textures = this.textures;

		for(let y = 0; y < map.height; y++)
		{
			for(let x = 0; x < map.width; x++)
			{
				rgba = this.textures.getPixel(x, y, 'map'+String(level))._rgba;
				px = x*TileSize;
				py = y*TileSize;

				if(rgba == "rgba(128,128,128,1)")
				{
					tile = this.add.sprite( px, py, 'wall' );
					tile.setOrigin(0);
					tile.mode = 0;
				}

				if(rgba == "rgba(0,0,255,1)")
				{
					player = this.add.sprite( px, py, 'player' );
					player.setOrigin(0);

					playerIndex = objects.length;
					tile = 0;
				}

				if(rgba == "rgba(255,128,0,1)")
				{
					tile = this.add.sprite( px, py, 'crate' );
					tile.setOrigin(0);
					tile.mode = 1;
					tile.depth = 1;
				}

				if(rgba == "rgba(0,255,0,1)")
				{
					tile = this.add.sprite( px, py, 'target' );
					tile.setOrigin(0);
					tile.mode = 2;
					targets++;
				}

				if(rgba == "rgba(255,255,255,1)")
				{
					tile = 0;
				}

				tile.underlaying = 0;

				objects.push(tile);
			}
		}

		keyDown.push(
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
		);
		
		let offset = 220;
		let offx = 60;
		let padding = 120;
		
		score = this.add.text(
			map.width*TileSize/2-(config.width/2)/zoom+offx,
			map.height*TileSize/2-(config.height/2)/zoom+offset,
			"Placed: 0",
			{ fontFamily: 'Arial', fontSize: 64, color: '#000000' }
		).setOrigin(0).setStyle({ backgroundColor: '#FFF' }).setPadding(10);

		movesText = this.add.text(
			map.width*TileSize/2-(config.width/2)/zoom+offx,
			map.height*TileSize/2-(config.height/2)/zoom+offset+padding,
			"Moves left: "+String(movesLeft),
			{ fontFamily: 'Arial', fontSize: 64, color: '#000000' }
		).setOrigin(0).setStyle({ backgroundColor: '#FFF' }).setPadding(10);

		player.depth = 1;
		score.depth = 1;
		movesText.depth = 1;

		buttons.push(new Button(
			map.width*TileSize/2-(config.width/2)/zoom+64,
			map.height*TileSize/2-(config.height/2)/zoom+64,
			'⏸️ menu',
			this,
			() => Game.scene.switch('GameScene', 'pause menu')
		));

		buttons[0].object.setScale(1/zoom);
		buttons[0].object.setOrigin(0);
	},

	update: function(){
		control();
		score.setText("Placed: "+String(placedCrates));
		movesText.setText("Moves left: "+String(movesLeft));

		if(placedCrates == targets){
			if(level+1 != levels){
				level++;
				this.scene.restart();
			}
		}

		if(Phaser.Input.Keyboard.JustDown(keyDown[4])){
			this.scene.restart();
		}
	}
});

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function setup()
    {
        Phaser.Scene.call(this, { key: 'menu', active: true });

        this.frames;
    },

    preload: function ()
    {
		this.load.image('bg', 'assets/thumbnail.png');
	},

    create: function ()
    {
		buttons = []
		let bg = this.add.image(0,0,'bg');
		//bg.setOrigin(0);
		let scale = 0.9;
		let tint = 0.5;
		bg.setPosition(config.width/2, config.height/2);

		this.cameras.main.backgroundColor.setTo(255*tint, 255*tint, 255*tint);
		//this.cameras.main.backgroundColor.setTo(255, 255, 255);
		let offx = config.width/2;
		let offy = config.height/2+230;

		buttons.push(new Button(
			offx, offy,
			'Start Game ➤',
			this,
			() => {
				this.scene.stop("GameScene")
				this.scene.start("GameScene")
			}
		));

		buttons.push(new Button(
			offx, offy+50,
			'sound on 🔊',
			this,
			() => {
				if(buttons[1].object.text == 'sound on 🔊'){
					buttons[1].object.setText('sound off 🔇');
				} else {
					buttons[1].object.setText('sound on 🔊');
				}
			}
		));

		if(config.width > config.height){
			bg.setScale(config.height/bg.height*scale, config.height/bg.height*scale);
			
		} else {
			bg.setScale(config.width/bg.width*scale, config.width/bg.width*scale);
		}
		bg.setTint(Phaser.Display.Color.GetColor(tint*255,tint*255,tint*255));
	}
});

var PauseMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function setup()
    {
        Phaser.Scene.call(this, { key: 'pause menu', active: false });

        this.frames;
    },

    preload: function ()
    {
	},

    create: function ()
    {
		tint = 0.8;
		this.cameras.main.backgroundColor.setTo(255*tint, 255*tint, 255*tint);
		buttons = [];
		let offy = -50;

		buttons.push(new Button(
			config.width/2,
			config.height/2+offy,
			'⬅️ main menu',
			this,
			() => Game.scene.switch('pause menu', 'menu')
		));

		buttons.push(new Button(
			config.width/2,
			config.height/2+100+offy,
			'restart 🔄',
			this,
			() => {
				Game.scene.stop('GameScene');
				this.scene.start('GameScene');
			}
		));
		buttons.push(new Button(
			config.width/2,
			config.height/2+50+offy,
			'resume ▶️',
			this,
			() => Game.scene.switch('pause menu', 'GameScene')
		));
	}
});

var Settings = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function setup()
    {
        Phaser.Scene.call(this, { key: 'settings', active: false });

        this.frames;
    },

    preload: function ()
    {
	},

    create: function ()
    {
		tint = 0.8;
		this.cameras.main.backgroundColor.setTo(255*tint, 255*tint, 255*tint);
	}
});