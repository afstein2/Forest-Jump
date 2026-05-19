class Platformer extends Phaser.Scene {

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
        this.setupPhysics();
        this.setupUI();
        this.setupMap();      // calls overrideable method
        this.setupObjects();
        this.setupPlayer();
        this.setupInput();
        this.setupVFX();
        this.setupCamera();
    }

    setupPhysics() {

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
    }

    // Subclasses override this to load their own map
    setupMap() {}


    // UI  -----------------------------------------------

    setupUI() {
        
        if (my.score) {
            this.score = my.score;
        } 
        
        else {
            this.score = 0;
        }

        my.scoreCarryOver = false;  // reset the flag
        my.score = this.score;
        
        this.scoreText = this.add.text(game.config.width / 5.2, game.config.height / 5.5, `${this.score}`, {
            fontSize: '128px', fill: '#ffffff'
        }).setScrollFactor(0).setDepth(100).setScale(0.5);

        this.coinIcon = this.add.image(game.config.width / 5.5, game.config.height / 4.7, "coin_icon");
        this.coinIcon.setScrollFactor(0).setScale(3).setDepth(1000);


        // Create FPS Text
        if (my.settings.fps) {
            this.fpsText = this.add.text(game.config.width / 1.3, game.config.height / 5.5, '', {
                fontSize: '48px',
                fill: '#ffffff'
            }).setScrollFactor(0).setDepth(200).setScale(0.5);
        }
    }

    // OBJECTS  -----------------------------------------------

    setupObjects() {
        // Coins
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin", key: "tilemap_sheet", frame: 151
        });
        this.coins.forEach((coin) => {
            coin.setScale(this.SCALE);
            coin.x *= this.SCALE;
            coin.y *= this.SCALE;
        });
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        // Flags
        this.flags = this.map.createFromObjects("Objects", {
            name: "flag", key: "tilemap_sheet", frame: 111
        });
        this.flags.forEach((flag) => {
            flag.setScale(this.SCALE);
            flag.x *= this.SCALE;
            flag.y *= this.SCALE;
        });
        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);
        this.flagGroup = this.add.group(this.flags);

        // Spikes
        this.spikes = this.map.createFromObjects("Objects", {
            name: "spike", key: "tilemap_sheet", frame: 68
        });
        this.spikes.forEach((spike) => {
            spike.setScale(this.SCALE);
            spike.x *= this.SCALE;
            spike.y *= this.SCALE;
        });
        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);
        this.spikeGroup = this.add.group(this.spikes);
    }


    // PLAYER  ---------------------------------------------------------

    setupPlayer() {
        my.sprite.player = this.physics.add.sprite(
            this.playerStart.x,
            this.playerStart.y,
            "platformer_characters",
            "tile_0000.png"
        );
        my.sprite.player.setScale(this.SCALE);
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Coin overlap
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.score += 1;
            my.score = this.score;
            this.scoreText.setText(`${this.score}`);
            obj2.destroy();
        });

        // Flag overlap - calls overrideable method
        this.physics.add.overlap(my.sprite.player, this.flagGroup, () => {
            this.onLevelComplete();
        });

        // Spike overlap
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, () => {
            this.scene.restart();
        });
    }

    // Subclasses override this
    onLevelComplete() {}

    // INPUT ---------------------------------------------------------

    setupInput() {
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
        this.pKey = this.input.keyboard.addKey('P');
        this.aKey = this.input.keyboard.addKey('A');
        this.dKey = this.input.keyboard.addKey('D');

        this.input.keyboard.on('keydown-O', () => {
            this.physics.world.drawDebug = !this.physics.world.drawDebug;
            this.physics.world.debugGraphic.clear();
        }, this);
    }

     // VFX ---------------------------------------------------------   

    setupVFX() {
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            random: true,
            scale: { start: 0.03, end: 0.1 },
            maxAliveParticles: 8,
            lifespan: 350,
            gravityY: -400,
            alpha: { start: 1, end: 0.1 },
        });
        my.vfx.walking.stop();
    }


    // CAMERA ---------------------------------------------------------

    setupCamera() {
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
    }

    update() {
        if (my.settings.fps && this.fpsText) {
            this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
        }

        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.pause();
            this.scene.launch('pauseScene');
        }


        // Controls A,D, Space

        if (this.aKey.isDown || cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();

        } else if (this.dKey.isDown || cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) my.vfx.walking.start();

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if (my.sprite.player.body.blocked.down &&
            (Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(cursors.up))) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.score = 0;
            this.scene.restart();
        }
    }
}
