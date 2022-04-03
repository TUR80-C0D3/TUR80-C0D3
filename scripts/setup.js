
"using strict"

var config = {
	type: Phaser.AUTO,
	width: window.innerWidth-20,
	height: window.innerHeight-21,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		}
	},
	scene: [MainMenu, PauseMenu, Settings, GameScene]
};

var Game = new Phaser.Game(config);