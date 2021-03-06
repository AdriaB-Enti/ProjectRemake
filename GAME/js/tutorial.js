var platformer = platformer || {};

window.onkeydown = function(event) {
    if(platformer.tutorial.inPlay==true){
        if (event.keyCode == 27&&platformer.game.paused==false){
            platformer.game.paused = true;
            this.menuPause = new platformer.menuPause(platformer.game,platformer.tutorial.camera.x+gameOptions.gameWidth/2,platformer.tutorial.camera.y+gameOptions.gameHeight/2);
            this.cursor = new platformer.cursorPrefab(platformer.game,platformer.tutorial.camera.x+gameOptions.gameWidth/2-90, platformer.tutorial.camera.y + gameOptions.gameHeight/2-10);
            this.cursorState=0;
        }
        if(event.keyCode == 40&&platformer.game.paused==true){
            if(this.cursor.y>=platformer.tutorial.camera.y + gameOptions.gameHeight/2+60){
                 this.cursor.y=platformer.tutorial.camera.y + gameOptions.gameHeight/2-10;
                 this.cursorState=0;
            }
            else{
                this.cursor.y+=35;
                this.cursorState++;
            }
        }
        if(event.keyCode == 38&&platformer.game.paused==true){
            if(this.cursor.y<=platformer.tutorial.camera.y + gameOptions.gameHeight/2-10){
                 this.cursor.y= platformer.tutorial.camera.y + gameOptions.gameHeight/2+60;
                this.cursorState=2;
            }
            else {
                this.cursor.y-=35;
                this.cursorState--;
             }
        }
        switch(this.cursorState){
            case 0:
                 this.cursor.x=platformer.tutorial.camera.x+gameOptions.gameWidth/2-90;
                 if (event.keyCode == 13&&platformer.game.paused==true){
                     platformer.game.paused = false;
                     this.menuPause.kill();
                     this.cursor.kill();
                 }
                break;
            case 1:
                this.cursor.x=platformer.tutorial.camera.x+gameOptions.gameWidth/2-100;
                if (event.keyCode == 13&&platformer.game.paused==true){
                    platformer.game.paused = false;
                    this.menuPause.kill();
                    this.cursor.kill();
                    platformer.tutorial.themeMusic.stop();
                    platformer.game.state.start('tutorial');
                }
                break;
            case 2:
                this.cursor.x=platformer.tutorial.camera.x+gameOptions.gameWidth/2-65;
                if (event.keyCode == 13&&platformer.game.paused==true){
                    platformer.game.paused = false;
                    this.menuPause.kill();
                    this.cursor.kill();
                    platformer.game.state.start('mainMenu');
                }
                break;
        }
    }
    
}

platformer.tutorial = {
	init:function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.setGameSize(gameOptions.gameWidth, gameOptions.gameHeight); 	
        this.game.world.setBounds(0, 0, gameOptions.level1Width, gameOptions.level1Height);
        //player init value
        this.with_cloth=true;
        this.player_life=gameOptions.playerLife;
        this.isPlay=true;
	},
	preload:function(){
        //MAPA
        this.load.image('bg','img/mapa_level1.png');
		this.load.tilemap('map','TileMaps/mapa_level.json',null,Phaser.Tilemap.TILED_JSON);
        this.load.image('platform_collision','img/platform_collision.png');   
        //PLAYER SPRITE
        this.load.spritesheet('hero', 'img/arthur.png', 64, 64);
        //HUD SPRITE
        this.load.spritesheet('hud', 'img/HUD-armes.png', 4, 4);
        //armourAnimation
        this.load.spritesheet('armaduraGone', 'img/armourGone.png', 128, 128);

        //EXPLOSION SPRITES
        this.load.spritesheet('explosion_medium', 'img/mediumExplosion.png', 64, 64);
        this.load.spritesheet('explosion_normal', 'img/normalExplosion.png', 64, 64);
		
        //ENEMY BULLET SPRITES
        this.load.spritesheet('ull', 'img/ull.png', 18, 18);
        
        //ENEMY SPRITES
        this.load.spritesheet('planta', 'img/Planta.png', 36, 64);
        this.load.spritesheet('crow', 'img/crow.png', 36, 32);
		this.load.spritesheet('zombie', 'img/zombie.png', 32, 32);
        
        //RED DEVIL
        this.load.spritesheet('redDevil', 'img/redDevil.png', 42, 42);
        
        //BULLET SPRITES
        this.load.image('arma_lance','img/lance.png');
        //GRAVE
        this.load.image('grave0','img/grave0.png');
        this.load.image('grave1','img/grave1.png');
        this.load.image('grave2','img/grave2.png');
        //LADDER
        this.load.image('ladders', 'img/ladder.png');
        this.load.image('menu_pausa', 'img/menu pausa.png');
        //KEY
        this.load.image('key', 'img/key.png');
        //SO
        this.game.load.audio('theme_music','sounds/gngTheme.mp3');
        this.game.load.audio('player_Shoot','sounds/lance.mp3');
        this.game.load.audio('zombieBorn','sounds/zombieBorn.mp3');
        this.game.load.audio('enemyDeath','sounds/enemyDeath.wav');
        this.game.load.audio('devilHit','sounds/devilHit.wav');
        this.game.load.audio('hitGrave','sounds/hitGrave.mp3');
        //ADD motor de physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = gameOptions.playerGravity;
	},
	create:function(){
        //GRAVES
        this.createGraves();
        //LADDERS
        this.createLadders();
        //BACKGROUND
        this.bg = this.game.add.tileSprite(0,0,gameOptions.level1Width, gameOptions.level1Height, 'bg');
		
		//MAP
		this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('platform_collision');

        this.platform_collision = this.map.createLayer('platform_up');
       
        this.map.setCollisionBetween(2,5,true,'platform_up');
		
		this.map.createLayer('platform_up');	
        this.map.createLayer('ladder');	
        
		//CONTROLS
		this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jump_key=this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.playKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        
        //PLAYER ->(game,x,y, _level,_player_life,_cursors,_jump_key,_space,_with_cloth)
        this.hero = new platformer.playerPrefab(this.game,gameOptions.gameWidth/2,350,this,this.player_life,this.cursors,this.jump_key,this.space,this.with_cloth );
        
        //BALES DEL PERSONATGE
        this.projectiles = this.add.group();  
        //BALES DELS ENEMICS
        this.enemyProjectiles = this.add.group();
        //EXPLOSIONS
        this.explosions = this.add.group();
        
        //KEY - la instanciara el cyborg al morir
        new platformer.keyPrefab(this.game,7000,0,this);
        
        //ENEMIES
        this.enemies = this.add.group();
        this.createPlants();
		this.createCrows();
        this.enemies.add (new platformer.zombiePrefab(this.game,200+gameOptions.gameWidth/2,350,this));
        this.redDevil = new platformer.RedDemonPrefab(this.game,2900,350,this);
		//CAMERA
		this.camera.follow(this.hero);
        //HUD
        this.hud = new platformer.hudPrefab(this.game,0,0);
		//MUSIC
        this.themeMusic=this.add.audio('theme_music');
        this.themeMusic.loop = true; 
        this.themeMusic.play();      
        //MENU PAUSA
        this.inPlay=true;
	},
	update:function(){
        if(this.themeMusic.loop==false) this.themeMusic.stop();
	},
    createGraves:function(){
      // Creo il gruppo delle tombe
      this.graves = this.game.add.group();
      this.graves.enableBody = true;
      this.graves.immovable = true;
      
      // Creo le singole tombe
      this.createGrave(0,64,324,0 );
      this.createGrave(0,64,324,0 );
      this.createGrave(0,474,324,1);
      this.createGrave(1,280,324,0);
      this.createGrave(2,-10,324,2);
      this.createGrave(2,442,324,0);
      this.createGrave(2,474,164,1);
      this.createGrave(3,156,164,2);
      this.createGrave(3,348,164,2);
      this.createGrave(3,348,324,0);
      this.createGrave(4,124,324,0);
      this.createGrave(4,444,324,1);
      this.createGrave(5,442,324,2);
    },
    createGrave:function (part,x,y,key){
      grave = this.graves.create(512*part+x, y, "grave"+key);
      grave.body.immovable = true;
      grave.body.allowGravity = false;
      grave.body.checkCollision.down = false;
      grave.body.setSize(32,36,16,28);
    },
    createLadders:function(){
      // Creo il gruppo per le scale
      this.ladders = this.game.add.group();
      this.ladders.enableBody = true;
      this.ladders.immovable = true;

      this.createLadder(512*2+388);
      this.createLadder(512*3+262);
      this.createLadder(512*4+70);

    },
    createLadder:function(x){
     ladder = this.ladders.create(x, 212, "ladders");
     ladder.body.immovable = true;
     ladder.body.allowGravity=false;
     ladder.width = 46;
     ladder.height = 172;
    }
};

platformer.tutorial.createPlants = function(){
	//var plantaTest = new platformer.plantaPrefab(this.game,400+gameOptions.gameWidth/2,350,this);
	this.enemies.add(new platformer.plantaPrefab(this.game,1628,202,this));
	this.enemies.add(new platformer.plantaPrefab(this.game,2210,202,this));
};
platformer.tutorial.createCrows = function(){
	this.enemies.add(new platformer.crowPrefab(this.game,1498,332,this));
	this.enemies.add(new platformer.crowPrefab(this.game,1724,172,this));
	this.enemies.add(new platformer.crowPrefab(this.game,2206,332,this));
	this.enemies.add(new platformer.crowPrefab(this.game,2524,332,this));
	this.enemies.add(new platformer.crowPrefab(this.game,3036,332,this));
}