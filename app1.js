
var score = 0;
var scoreText;
var level = 1;
var endgametext;


class sceneA extends Phaser.Scene {
	
    constructor ()
    {
        super();
        this.player = [];
		this.cursors = [];

		this.stars = [];
		this.bombs = [];
		this.fireballs = [];		
		this.movingplatform = [];
    }	
	
	
    preload ()
    {
	
		this.load.image('sky', 'assets/img/sky.png');
		this.load.image('ground', 'assets/img/platform.png');
		this.load.image('groundgreen', 'assets/img/ground.png');
		this.load.image('star', 'assets/img/star.png');
		this.load.image('bomb', 'assets/img/bomb.png');
		this.load.image('fireball', 'assets/img/fireball.png');
		this.load.spritesheet('dude', 
        'assets/img/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
	
    }

    create ()
    {
		// budowanie tla 
		this.add.image(0, 0, 'sky').setOrigin(0,0);
		
		/*
		for(i=0;i<=10;i++){
		
			var newx = i * 35;
			this.add.image(newx, 0, 'star').setOrigin(0,0);
		}
		*/

		var platforms;

		scoreText = this.add.text(16, 16, 'score: 0 level: 1', { fontSize: '32px', fill: '#000' });
		//endgametext = 
		
	/*	
		var bricks = this.physics.add.staticGroup({
  key: 'groundgreen',
  repeat: 9,
  setXY: {
    x: 80,
    y: 140,
    stepX: 30
  }
});*/

		//bricks.enableBody = true;
		
		
		//elementy statyczne, ktore sie nie przemieszczaja
		platforms = this.physics.add.staticGroup();

		//setScale(2) - rozciaga na caly ekran
		//refreshBody() - odswierzenie po przeskalowaniu
		platforms.create(400, 568, 'ground').setScale(2).refreshBody();

	//	platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');		
	
	/*
	platforms.create({
  key: 'groundgreen',
  repeat: 9,
  setXY: {
    x: 80,
    y: 140,
    stepX: 30
  }
});		
*/

    this.movingplatform = this.physics.add.image(400, 400, 'ground');

    this.movingplatform.setImmovable(true);
    this.movingplatform.body.allowGravity = false;
    this.movingplatform.setVelocityX(50);

		
		//postac
		 this.player = this.physics.add.sprite(100, 450, 'dude');

		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});		

		//gwiazdki
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		this.stars.children.iterate(function (child) {

			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));

		});		


		this.bombs = this.physics.add.group();
		this.fireballs = this.physics.add.group();


		
		
		// definicja kolizji
		this.physics.add.collider(this.player, platforms);
		this.physics.add.collider(this.player, this.movingplatform);
		this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

	//	this.physics.add.collider(this.player, bricks);
		
		this.physics.add.collider(this.stars, platforms);
		this.physics.add.collider(this.stars, this.movingplatform);
	//	this.physics.add.collider(this.stars, bricks);
//		this.physics.add.collider(stars, this.player);
this
		this.physics.add.collider(this.bombs, platforms);
		this.physics.add.collider(this.bombs, this.movingplatform);

		this.physics.add.collider(this.fireballs, this.bombs, hitFireballs, null, this);

	
		this.cursors = this.input.keyboard.createCursorKeys();
	
		// czy gwiazdki nie nachodza na gracza
		this.physics.add.overlap(this.player, this.stars, collectStar, null, this);	

	
    }

    update ()
    {
	
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160);

			this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160);

			this.player.anims.play('right', true);
		}
		else
		{
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-350);
		}

		if(this.cursors.space.isDown){

			 //if (fireballs.countActive(true) === 0)
			 {
				var fireball = this.fireballs.create(0, 0, 'fireball');	
				fireball.setPosition(this.player.x, this.player.y);
			
				
				if (this.cursors.left.isDown){
					fireball.setVelocity(-800, -20);
				}


				if (this.cursors.right.isDown){
					fireball.setVelocity(800, -20);
				}


			 }
		
		}
		
		
		if (this.movingplatform.x >= 500)
		{
			this.movingplatform.setVelocityX(-50);
		}
		else if (this.movingplatform.x <= 300)
		{
			this.movingplatform.setVelocityX(50);
		}
		
    }	
	
}




var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [sceneA]
};




var game = new Phaser.Game(config);



function collectStar (player, star)
{
    star.disableBody(true, true);
	

    score += 10;
    scoreText.setText('Score: ' + score + ' level: ' + level);	
	
    if (this.stars.countActive(true) === 0)
    {
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

		level ++;
		
		scoreText.setText('Score: ' + score + ' level: ' + level);		
    }	
	
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

	this.add.text(150, 300, 'Game Over! Hit F5 to restart', { fontSize: '32px', fill: '#fff' });
	

    gameOver = true;
	
	
}


function hitFireballs(fireballs, bomb)
{
	console.log('uderzylem');
	
	bomb.disableBody(true, true);
}


