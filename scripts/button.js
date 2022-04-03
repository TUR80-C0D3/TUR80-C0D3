let buttons = [];

class Button {

    constructor(x, y, label, scene, callback) {
        this.object = scene.add.text(x, y, label)
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => callback())
            .on('pointerover', () => this.object.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => this.object.setStyle({ fill: '#FFF' }));
    }
}