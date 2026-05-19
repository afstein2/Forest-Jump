class PauseScene extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        const centerX = game.config.width / 2;
        const centerY = game.config.height / 2;

        // Dim overlay
        this.add.rectangle(
            centerX, centerY,
            game.config.width, game.config.height,
            0x000000, 0.6
        );

        // Pause title
        this.add.text(centerX, centerY - 100, 'PAUSED', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Resume
        this.add.text(centerX, centerY, 'Press P to Resume', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Restart
        this.add.text(centerX, centerY + 50, 'Press R to Restart', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Resume
        this.input.keyboard.once('keydown-P', () => {
            this.scene.resume('platformerScene');
            this.scene.stop();
        });

        // Restart
        this.input.keyboard.once('keydown-R', () => {
            this.scene.stop();
            this.scene.start('platformerScene');
        });
    }
}