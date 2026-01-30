import { MovableObject } from './movable-object.class.js';

export class Cloud extends MovableObject {
  constructor(existingClouds = [], minDistance = 200, levelWidth = 6500) {
    super();

    // Zufälliges Cloud-Bild
    const cloudVariant = Math.random() < 0.5 ? '1' : '2';
    super.loadImage(`./assets/img/5_background/layers/4_clouds/${cloudVariant}.webp`);

    this.y = 50 + Math.random() * 50;
    this.width = 300 + Math.random() * 200;
    this.height = 150 + Math.random() * 100;
    this.speed = 0.3; // Fixe Standardgeschwindigkeit

    this.levelWidth = levelWidth;
    this.x = this.findValidPosition(existingClouds, minDistance);

    this.lastUpdateTime = null; // ⚠️ wichtig: Start mit null
  }

  findValidPosition(existingClouds, minDistance, maxTries = 50) {
    for (let i = 0; i < maxTries; i++) {
      const candidateX = Math.random() * this.levelWidth;
      if (existingClouds.every(c => this.isFarEnough(candidateX, c, minDistance))) {
        return candidateX;
      }
    }
    console.warn("⚠️ Wolke zufällig platziert (keine perfekte Position)");
    return Math.random() * this.levelWidth;
  }

  isFarEnough(candidateX, other, minDistance) {
    return (
      candidateX + this.width + minDistance < other.x ||
      candidateX > other.x + other.width + minDistance
    );
  }

  update(timestamp) {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = timestamp;
      return; // beim ersten Frame nichts bewegen
    }

    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;

    this.x -= this.speed * (deltaTime / (1000 / 60));

    if (this.x <= -this.width) {
      this.x = this.levelWidth + this.width;
      this.y = 50 + Math.random() * 50;
      const cloudVariant = Math.random() < 0.5 ? '1' : '2';
      this.loadImage(`./assets/img/5_background/layers/4_clouds/${cloudVariant}.webp`);
    }
  }

  draw(ctx) {
    if (this.img) ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
