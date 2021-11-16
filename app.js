

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
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};


var score = 0;
var scoreText;
var level = 1;
var endgametext;


var game = new Phaser.Game(config);

    function preload ()
    {
	
		this.load.image('sky', 'assets/img/sky.png');
		this.load.image('ground', 'assets/img/platform.png');
		this.load.image('star', 'assets/img/star.png');
		this.load.image('bomb', 'assets/img/bomb.png');
		this.load.image('fireball', 'assets/img/fireball.png');
		this.load.spritesheet('dude', 
        'assets/img/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
	
    }

    function create ()
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
		
		
		//elementy statyczne, ktore sie nie przemieszczaja
		platforms = this.physics.add.staticGroup();

		//setScale(2) - rozciaga na caly ekran
		//refreshBody() - odswierzenie po przeskalowaniu
		platforms.create(400, 568, 'ground').setScale(2).refreshBody();

		platforms.create(600, 400, 'ground');
		platforms.create(50, 250, 'ground');
		platforms.create(750, 220, 'ground');		
		
		
		//postac
		player = this.physics.add.sprite(100, 450, 'dude');

		player.setBounce(0.2);
		player.setCollideWorldBounds(true);

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
		stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});

		stars.children.iterate(function (child) {

			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));

		});		


		bombs = this.physics.add.group();
		fireballs = this.physics.add.group();


		
		
		// definicja kolizji
		this.physics.add.collider(player, platforms);
		this.physics.add.collider(stars, platforms);
//		this.physics.add.collider(stars, player);

		this.physics.add.collider(bombs, platforms);

		this.physics.add.collider(player, bombs, hitBomb, null, this);
		this.physics.add.collider(fireballs, bombs, hitFireballs, null, this);

	
		cursors = this.input.keyboard.createCursorKeys();
	
		// czy gwiazdki nie nachodza na gracza
		this.physics.add.overlap(player, stars, collectStar, null, this);	

	
    }

    function update ()
    {
	
		if (cursors.left.isDown)
		{
			player.setVelocityX(-160);

			player.anims.play('left', true);
		}
		else if (cursors.right.isDown)
		{
			player.setVelocityX(160);

			player.anims.play('right', true);
		}
		else
		{
			player.setVelocityX(0);

			player.anims.play('turn');
		}

		if (cursors.up.isDown && player.body.touching.down)
		{
			player.setVelocityY(-350);
		}

		if(cursors.space.isDown){
		//	console.log('spacja');
		//	var fireball = this.phisics.create(0,0,'fireball');
		//	var fireball = this.add.follower(null, 50, 350, 'fireball');
			//var fireball = fireballs.create(0, 0, 'fireball');	
fireball = this.add.follower(null, 50, 350, 'fireball');			
			fireball.setPosition(player.x, player.y);

		
		    curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(player.x, player.y), new Phaser.Math.Vector2(player.x+800, player.y));

			fireball.setPath(curve);
			fireball.startFollow(300);
		
		
		}
	
    }

function collectStar (player, star)
{
    star.disableBody(true, true);
	

    score += 10;
    scoreText.setText('Score: ' + score + ' level: ' + level);	
	
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
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
	bomb.disableBody(true, true);
}


