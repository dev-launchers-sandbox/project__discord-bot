import Phaser from "phaser";

import Character from "./classes/Character.js";

class PlayScene extends Phaser.Scene {
  preload() {
    this.load.spritesheet("johnny", "./assets/johnny_sprite.png", {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
  }

  create() {
    this.johnny = new Character(this, 10, 0);
    this.johnny.sprite.setCollideWorldBounds(true);

    const camera = this.cameras.main;
    const cursors = this.input.keyboard.createCursorKeys();
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);

    // Upper platform
    this.physics.add.collider(
      this.johnny.sprite,
      this.addPhysicalRectangle(150, 100, 500, 10, 0x00aa00)
    );

    // Middle platform
    this.physics.add.collider(
      this.johnny.sprite,
      this.addPhysicalRectangle(350, 200, 500, 10, 0x00aa00)
    );

    // Lower platform
    this.physics.add.collider(
      this.johnny.sprite,
      this.addPhysicalRectangle(250, 300, 500, 10, 0x00aa00)
    );

    this.add
      .text(64, 0, "Arrow keys to move and jump", {
        font: "8px monospace",
        fill: "#ffffff",
        padding: { x: 1, y: 1 },
        backgroundColor: "#000000"
      })
      .setScrollFactor(0);
  }

  update(time, delta) {
    this.johnny.update(time, delta);
  }

  /* <Begin> helper functions added by Kris */
  //
  //

  addPhysicalRectangle(x, y, width, height, color, alphaIThinkMaybe) {
    // TODO: alphaIThinkMaybe name change
    let rect = this.add.rectangle(x, y, width, height, color, alphaIThinkMaybe);
    rect = this.physics.add.existing(rect, true);

    return rect;
  }

  /* </End> Helper functions added by kris */
}

const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 300,
  parent: "game-container",
  pixelArt: true,
  zoom: 1,
  backgroundColor: "#000000",
  scene: PlayScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 }
    }
  }
};

const game = new Phaser.Game(config);
let controls;
