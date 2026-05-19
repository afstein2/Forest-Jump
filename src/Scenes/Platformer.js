class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;

        // particles
        this.PARTICLE_VELOCITY = 50;

        // world scaling
        this.SCALE = 1.5;
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



        // CREATE UI  -----------------------------------------------

        // Create FPS Text
        if (my.settings.fps) {
            this.fpsText = this.add.text(game.config.width / 1.3, game.config.height / 5.5, '', {
                fontSize: '48px',
                fill: '#ffffff'
            }).setScrollFactor(0).setDepth(200).setScale(0.5);
        }


        // Create Score Text
        this.score = 0;

        this.scoreText = this.add.text(game.config.width / 5.2, game.config.height / 5.5, '0', {
            fontSize: '128px',
            fill: '#ffffff'
        }).setScrollFactor(0).setDepth(100).setScale(0.5)

        // // Coin icon for UI
        this.coinIcon = this.add.image(game.config.width / 5.5, game.config.height / 4.7,  "coin_icon");
        this.coinIcon.setScrollFactor(0);
        this.coinIcon.setScale(3);
        this.coinIcon.setDepth(1000);



        // SETUP MAP & TILESETS -----------------------------------------------


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);


        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage(
            "kenny_tilemap_packed",
            "tilemap_tiles"
        );


        // Add Background Trees Tile map
        this.bgtileset = this.map.addTilesetImage(
            "foliagePack_vector",
            "bgmap_tiles"
        );


        // Create background color
        this.cameras.main.setBackgroundColor('#73bde2');


        // CREATE LAYERS -------------------------------------------------

        this.treesLayer = this.map.createLayer(
            "BackgroundTrees",
            this.bgtileset,
            0,
            0
        );

        this.groundLayer = this.map.createLayer(
            "Ground-n-Platforms",
            this.tileset,
            0,
            0
        );

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        // Scale map layers
        this.treesLayer.setScale(this.SCALE);
        this.groundLayer.setScale(this.SCALE);


        // OBJECTS  -----------------------------------------------



        // Coins 

        // Find coins in the "Objects" layer in Phaser
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });


        // Scale and reposition coins
        this.coins.forEach((coin) => {
            coin.setScale(this.SCALE);
            coin.x *= this.SCALE;
            coin.y *= this.SCALE;
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);


        // End Flags
        this.flags = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 111
        });


        // Scale and reposition flags
        this.flags.forEach((flag) => {
            flag.setScale(this.SCALE);
            flag.x *= this.SCALE;
            flag.y *= this.SCALE;
        });

        
        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);


        // Spikes
        this.spikes = this.map.createFromObjects("Objects", {
            name: "spike",
            key: "tilemap_sheet",
            frame: 68
        });

        // Scale and reposition spikes
        this.spikes.forEach((spike) => {
            spike.setScale(this.SCALE);
            spike.x *= this.SCALE;
            spike.y *= this.SCALE;
        });

        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);

        // Add groups
        this.coinGroup = this.add.group(this.coins);
        this.flagGroup = this.add.group(this.flags);
        this.spikeGroup = this.add.group(this.spikes);



        // PLAYER --------------------------------------------------------

        my.sprite.player = this.physics.add.sprite(
            game.config.width / 4,
            930,
            "platformer_characters",
            "tile_0000.png"
        );

        my.sprite.player.setScale(this.SCALE);
        my.sprite.player.setCollideWorldBounds(true);


        // Enable collision handling
        this.physics.add.collider(
            my.sprite.player,
            this.groundLayer
        );


        // COIN COLLISION -----------------------------------------------

        this.physics.add.overlap(
            my.sprite.player,
            this.coinGroup,
            (obj1, obj2) => {

                this.score += 1;
                this.scoreText.setText(`${this.score}`);

                obj2.destroy();
            }
        );



        // FLAG COLLISION -----------------------------------------------

        this.physics.add.overlap(
            my.sprite.player,
            this.flagGroup,
            (obj1, obj2) => {

                // go next level
                this.scene.start("platformerScene2");

            }
        );

        // SPIKE COLLISION -----------------------------------------------


        this.physics.add.overlap(
            my.sprite.player,
            this.spikeGroup,
            (obj1, obj2) => {

                // Restart Scene
                this.scene.restart(); 

            }
        );


        // INPUT ---------------------------------------------------------

        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
        this.pKey = this.input.keyboard.addKey('P');
        this.aKey = this.input.keyboard.addKey('A');
        this.dKey = this.input.keyboard.addKey('D');

        // DEBUG ---------------------------------------------------------

        this.input.keyboard.on('keydown-O', () => {
            this.physics.world.drawDebug = !this.physics.world.drawDebug;
            this.physics.world.debugGraphic.clear();
        }, this);


        // VFX -----------------------------------------------------------

        my.vfx.walking = this.add.particles(
            0,
            0,
            "kenny-particles",
            {
                frame: ['smoke_03.png', 'smoke_09.png'],
                random: true,
                scale: { start: 0.03, end: 0.1 },
                maxAliveParticles: 8,
                lifespan: 350,
                gravityY: -400,
                alpha: { start: 1, end: 0.1 },
            }
        );

        my.vfx.walking.stop();


        // CAMERA --------------------------------------------------------

        this.cameras.main.startFollow(
            my.sprite.player,
            true,
            0.25,
            0.25
        );

        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels * this.SCALE,
            this.map.heightInPixels * this.SCALE
        );

        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels * this.SCALE,
            this.map.heightInPixels * this.SCALE
        );

        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {


        // Update FPS Text
        if (my.settings.fps && this.fpsText) {
            this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
        }

        // Show Pause Menu Screen

        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.pause();
            this.scene.launch('pauseScene');
        }

        // Move Left
        if (this.aKey.isDown || cursors.left.isDown) {

            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            my.vfx.walking.startFollow(
                my.sprite.player,
                my.sprite.player.displayWidth / 2 - 10,
                my.sprite.player.displayHeight / 2 - 5,
                false
            );

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if(my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }


        // Move Right
        } 
        
        else if(this.dKey.isDown || cursors.right.isDown) {

            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            my.vfx.walking.startFollow(
                my.sprite.player,
                my.sprite.player.displayWidth / 2 - 10,
                my.sprite.player.displayHeight / 2 - 5,
                false
            );

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            if(my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {

            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');

            my.vfx.walking.stop();
        }


        // Jump
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if (
            my.sprite.player.body.blocked.down &&
            (Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(cursors.up))
        ) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }


        // Restart Scene
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}