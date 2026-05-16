class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -900;
    }

    create() {


        // Create Score Text
        this.score = 0;
        this.scoreText = this.add.text(16, 16, ' 0', { fontSize: '64px', fill: '#ffffff' });
        this.scoreText.setScrollFactor(0); // Make the score text stay fixed on the screen


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");


        // Create background color
        this.cameras.main.setBackgroundColor('#73bde2');

        // Create UI layer
        this.uiLayer = this.map.createLayer("UI", this.tileset, 0, 0);
        this.uiLayer.setScrollFactor(0);

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        

        // Create coins tiled layer
        this.coinLayer = this.map.createLayer("Coins", this.tileset, 0, 0);


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        this.groundLayer.setScale(2);
        this.coinLayer.setScale(2);
        this.uiLayer.setScale(5);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);


        this.physics.add.overlap(my.sprite.player, this.coinLayer, (player, tile) => {
            if (tile.properties.collectible) {
                this.coinLayer.removeTileAt(tile.x, tile.y);
                this.score += 1;
                this.scoreText.setText(' ' + this.score);
            }
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();


        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Camera follows player
        this.cameras.main.startFollow(my.sprite.player);

        // Set Camera bounds
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels * 2.5,
            this.map.heightInPixels * 2.5
        );


        // Set world bounds
        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels * 3,
            this.map.heightInPixels * 2.5
        );
    }

    update() {

        // Move Left
        if(this.keyA.isDown || cursors.left.isDown) {

            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        // Move right
        } else if(this.keyD.isDown || cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) || my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.space)) {

            my.sprite.player.setVelocityY(this.JUMP_VELOCITY);

        }
    }
}