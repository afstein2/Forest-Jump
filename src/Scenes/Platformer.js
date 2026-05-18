class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {

        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 1600;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -900;

        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.5;
    }

    create() {

        /*
        * Fix Collison clipping 
        * 
        * https://thoughts.amphibian.com/2016/02/dont-fall-through-tile-bias-in-phaser.html
        * 
        * ArcadeWorldConfig
        * https://docs.phaser.io/api-documentation/typedef/types-physics-arcade
        * 
        */ 
        
        this.physics.world.TILE_BIAS = 32;




        // Create Score Text
        this.score = 0;
        this.scoreText = this.add.text(16, 16, '  0', { fontSize: '64px', fill: '#ffffff' });
        this.scoreText.setScrollFactor(0); // Make the score text stay fixed on the screen


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Add Background Trees Tile map
        //this.bgtileset = this.map.addTilesetImage("foliagePack_vector", "bgmap_tiles")


        // Create background color
        this.cameras.main.setBackgroundColor('#73bde2');

        // Create UI layer
        this.uiLayer = this.map.createLayer("UI", this.tileset, 0, 0);
        this.uiLayer.setScrollFactor(0);

        // Create Trees Layer
        this.treesLayer = this.map.createLayer("BackgroundTrees", this.bgtileset, 0, 0);
        

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);



        // Create objects tiled layer
        //this.coinLayer = this.map.createLayer("Coins", this.tileset, 0, 0);
        //this.objectsLayer = this.map.createLayer("Objects", this.tileset, 0, 0)


        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
    


        this.coins.forEach((coin) => {
            coin.setScale(2.5);

            coin.x *= 2.5;
            coin.y *= 2.5;
        });


        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);


        this.groundLayer.setScale(2.5);
        this.treesLayer.setScale(2.5);
        //this.coinLayer.setScale(2.5);
        //this.objectsLayer.setScale(2.5);
        this.uiLayer.setScale(5);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, 20, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);


        // this.physics.add.overlap(my.sprite.player, this.coinLayer, (player, tile) => {
        //     if (tile.properties.collectible) {
        //         this.coinLayer.removeTileAt(tile.x, tile.y);
        //         this.score += 1;
        //         this.scoreText.setText('  ' + this.score);
        //     }
        // });


        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {

            // Update coins score text
            this.score += 1;
            this.scoreText.setText(`  ${this.score}`);
            obj2.destroy(); // remove coin on overlap
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);


        // Set random integer between min and max
        //let rVal = Phaser.Math.Between(min,max);


        // movement vfx
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random: true,
            scale: {start: 0.03, end: 0.1},
            maxAliveParticles: 8,
            lifespan: 350,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();
        

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


        // this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        // this.cameras.main.setDeadzone(50, 50);
        // this.cameras.main.setZoom(this.SCALE);




    }

    update() {


            if(cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

                my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                // Only play smoke effect if touching the ground
                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walking.start();

                }

            } else if(cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

                my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

                // Only play smoke effect if touching the ground
                if (my.sprite.player.body.blocked.down) {

                    my.vfx.walking.start();

                }

            } else {
                // Set acceleration to 0 and have DRAG take over
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                
                my.vfx.walking.stop();
            }

            // player jump
            // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
            if(!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
            }
            if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }

            if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
                this.scene.restart();
            }
        }
    }