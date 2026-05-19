class StartScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    create() {
        const centerX = game.config.width / 2;
        const centerY = game.config.height / 2;

        // Background color
        this.cameras.main.setBackgroundColor('#73bde2');

        // Title text
        this.add.text(centerX, centerY - 100, 'Forest Jump', {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Blinking start prompt
        const startText = this.add.text(centerX, centerY + 50, 'Press SPACE to Start', {
            fontSize: '24px',
            fill: '#ffffff',
        }).setOrigin(0.5);

        // Blink effect
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Start game on SPACE
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('loadScene');
        });
    }
}