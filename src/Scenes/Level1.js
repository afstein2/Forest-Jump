// Level1.js
class Level1 extends Platformer {
    constructor() {
        super("platformerScene");
    }

    setupMap() {
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.cameras.main.setBackgroundColor('#73bde2');

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.groundLayer.setScale(this.SCALE);

        this.playerStart = { x: game.config.width / 4, y: 930 };

    }

    // OVERRIDE
    setupObjects(){

        // Run Platformer setupObjects first
        super.setupObjects();


       /* ==================================================
        * Water Objects
        * ================================================= */

        // Water Barrier ----------------------------------------
        // Prevents player from falling through water
        this.barrier = this.add.zone(
            2150,   // x
            1080,    // y
            380,    // width
            10     // height
        );

        this.physics.world.enable(this.barrier);

        this.barrier.body.setAllowGravity(false);
        this.barrier.body.setImmovable(true);
        this.barrier.body.moves = false;


        // Water Zone ----------------------------------------
        this.waterZone = this.add.zone(
            2150,   // x
            1000,    // y
            380,    // width
            120     // height
        );

        this.waterZone = this.add.zone(2150, 1000, 380, 120);

        this.physics.world.enable(this.waterZone);


        this.waterZone.body.setAllowGravity(false);
        this.waterZone.body.setImmovable(true);
        this.waterZone.body.moves = false;
    }

    // setupPlayer() {

    // }


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
    }
    

    onLevelComplete() {
        my.scoreCarryOver = true;
        this.scene.start("platformerScene2");
    }
}