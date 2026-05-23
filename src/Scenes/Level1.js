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

        //this.clouds  = this.add.tileSprite(0, 0, W, H, 'clouds').setOrigin(0,0).setScrollFactor(0);


        this.playerStart = { x: game.config.width / 4, y: 930 };

        // Load Background Image Layer
        //this.add.image(centerX + 656, centerY, 'background').setDepth(-1).setScale(1.5);
        //this.backgroundLayer.setScale(this.SCALE);
    }

    onLevelComplete() {
        my.scoreCarryOver = true;
        this.scene.start("platformerScene2");
    }
}