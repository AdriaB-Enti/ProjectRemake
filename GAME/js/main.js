var platformer = platformer || {};

var gameOptions = {
	gameWidth:512,
	gameHeight:448,
	level1Height:448,
	level1Width:7168,
    playerLife:3,
    playerGravity:1000,
	playerSpeed:200,
	playerJumpForce:350,
    lanceSpeed:500,
    dagaSpeed:50,
    torchaSpeed:100,
    eyeSpeed:200,
    crowSpeed:170,
    crowXoffset:20,
    crowYoffset:3,
    zombieSpeed: 150,
};

platformer.game = new Phaser.Game(gameOptions.gameWidth,gameOptions.gameHeight,Phaser.AUTO,null,this,false,false);

platformer.game.state.add('mainMenu',platformer.mainMenu);
platformer.game.state.add('credits',platformer.credits);
platformer.game.state.add('ranking',platformer.ranking);
platformer.game.state.add('tutorial',platformer.tutorial);
platformer.game.state.add('level1',platformer.level1);
platformer.game.state.add('finalLevel',platformer.finalLevel);

platformer.game.state.start('mainMenu');

