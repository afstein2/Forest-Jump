// Level1.js
class Level1 extends Platformer {
    constructor() {
        super("platformerScene");
    }

    setupMap() {
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.bgtileset = this.map.addTilesetImage("foliagePack_vector", "bgmap_tiles");
        this.cameras.main.setBackgroundColor('#73bde2');

        this.treesLayer = this.map.createLayer("BackgroundTrees", this.bgtileset, 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.treesLayer.setScale(this.SCALE);
        this.groundLayer.setScale(this.SCALE);

        this.playerStart = { x: game.config.width / 4, y: 930 };
    }

    onLevelComplete() {
        my.scoreCarryOver = true;
        my.score = this.score;
        this.scene.start("platformerScene2");
    }
}