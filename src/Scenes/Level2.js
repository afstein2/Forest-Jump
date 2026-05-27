// Level2.js
class Level2 extends Platformer {
    constructor() {
        super("platformerScene2");
    }

    setupMap() {
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 45, 25);
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.cameras.main.setBackgroundColor('#73bde2');

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        
        console.log(this.map.getObjectLayer("Objects"));
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.groundLayer.setScale(this.SCALE);

        this.playerStart = { x: game.config.width / 4, y: 930 };

    }


    // OVERRIDE
    setupObjects(){

        super.setupObjects();

       /* ==================================================
        * Water Objects
        * ================================================= */

        // Water Barrier 
        // Prevents player from falling through water
        this.barrier = this.add.zone(
            1550,   // x
            1080,    // y
            380,    // width
            10     // height
        );

        this.physics.world.enable(this.barrier);

        this.barrier.body.setAllowGravity(false);
        this.barrier.body.setImmovable(true);
        this.barrier.body.moves = false;



        // Water Barrier 2
        // Prevents player from falling through water
        this.barrier2 = this.add.zone(
            2150,   // x
            1080,    // y
            380,    // width
            10     // height
        );

        this.physics.world.enable(this.barrier2);

        this.barrier2.body.setAllowGravity(false);
        this.barrier2.body.setImmovable(true);
        this.barrier2.body.moves = false;


        // Water Zone 1
        const zone1 = this.add.zone(
            1550,
            1000,
            380,
            120
        );

        this.physics.world.enable(zone1);

        zone1.body.setAllowGravity(false);
        zone1.body.setImmovable(true);
        zone1.body.moves = false;


        // Water Zone 2
        const zone2 = this.add.zone(
            2150,
            1000,
            380,
            120
        );

        this.physics.world.enable(zone2);

        zone2.body.setAllowGravity(false);
        zone2.body.setImmovable(true);
        zone2.body.moves = false;


        // Combine into one group
        this.waterZone = this.add.group([zone1, zone2]);
    }

    // OVERRIDE
    setupPlayer() {

        super.setupPlayer();


        // Water barrier overlap
        this.physics.add.collider(my.sprite.player, this.barrier2);
    }


    // OVERRIDE
    setupVFX() {

        // Run parent particles first
        super.setupVFX();

        // Remove default water emitter
        my.vfx.water.destroy();


        /* ==================================================
        * Water Bubbles
        * ================================================= */

        my.vfx.water = [];


        // Water Area 1 --------------------------------------

        const bubbles1 = this.add.particles(0, 0, "kenny-particles", {

            frame: "bubble_01.png",

            x: { min: 1400, max: 1700 },
            y: { min: 1200, max: 900 },

            lifespan: 1200,

            speedY: { min: -80, max: -40 },
            speedX: { min: -10, max: 10 },

            scale: { start: 0.08, end: 0 },

            alpha: { start: 0.8, end: 0 },

            quantity: 1,
            frequency: 120,

            blendMode: 'ADD',

            emitting: false
        });


        // Water Area 2 --------------------------------------

        const bubbles2 = this.add.particles(0, 0, "kenny-particles", {

            frame: "bubble_01.png",

            x: { min: 2000, max: 2300 },
            y: { min: 1200, max: 900 },

            lifespan: 1200,

            speedY: { min: -80, max: -40 },
            speedX: { min: -10, max: 10 },

            scale: { start: 0.08, end: 0 },

            alpha: { start: 0.8, end: 0 },

            quantity: 1,
            frequency: 120,

            blendMode: 'ADD',

            emitting: false
        });


        // Store emitters
        my.vfx.water.push(bubbles1);
        my.vfx.water.push(bubbles2);
    }





    onLevelComplete() {
        my.scoreCarryOver = true;
        my.score = this.score;
        this.scene.start("winScene");
    }
}