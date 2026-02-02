import { MovableObject } from './movable-object.class.js';

export class Projectile extends MovableObject {
  constructor(type, x, y, direction = true, maxDistance = 800) {
    super();
    this.type = type;
    this.direction = direction;
    this.x = x;
    this.y = y;

    this.width = 60;
    this.height = 60;

    this.speed = 10; // px pro Frame @60fps (so wie du es bisher benutzt hast)
    this.damage = 2;
    this.lifetime = 4000;
    this.isActive = true;
    this.markedForRemoval = false;

    this.startX = x;
    this.maxDistance = maxDistance;

    this.frameIndex = 0;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 8;
    this.state = "fly";

    this.lastUpdateTime = 0; // ✅ für deltaTime

    this.imageSets = {
      fireball: [
        './assets/img/entities/projectile/fireball/idle/image_1.png',
        './assets/img/entities/projectile/fireball/idle/image_2.png',
        './assets/img/entities/projectile/fireball/idle/image_3.png',
        './assets/img/entities/projectile/fireball/idle/image_4.png',
        './assets/img/entities/projectile/fireball/idle/image_5.png',
        './assets/img/entities/projectile/fireball/idle/image_6.png'
      ],
      fireball_explode: [
        './assets/img/entities/projectile/fireball/explode/image_1.png',
        './assets/img/entities/projectile/fireball/explode/image_2.png',
        './assets/img/entities/projectile/fireball/explode/image_3.png',
        './assets/img/entities/projectile/fireball/explode/image_4.png',
        './assets/img/entities/projectile/fireball/explode/image_5.png',
        './assets/img/entities/projectile/fireball/explode/image_6.png',
        './assets/img/entities/projectile/fireball/explode/image_7.png',
        './assets/img/entities/projectile/fireball/explode/image_8.png',
        './assets/img/entities/projectile/fireball/explode/image_9.png',
        './assets/img/entities/projectile/fireball/explode/image_10.png'
      ]
    };

    this.images = this.imageSets[type] || [];
    this.img = new Image();
    this.img.src = this.images[0];

    setTimeout(() => this.markedForRemoval = true, this.lifetime);
  }

  updateDeltaTime(timestamp) {
    if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
    this.deltaTime = (timestamp - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = timestamp;
  }

  updateState(timestamp) {
    this.updateDeltaTime(timestamp);

    if (this.state === "fly") {
      // ✅ deltaTime-bewegung (speed bleibt "pro 60fps-frame")
      const step = this.speed * (this.deltaTime ?? 1 / 60) * 60;
      this.x += this.direction ? step : -step;

      const traveled = Math.abs(this.x - this.startX);
      if (traveled >= this.maxDistance) {
        // entweder direkt entfernen:
        // this.markedForRemoval = true;

        // oder schön mit Explosionsanimation:
        this.explode();
      }
    }

    this.updateAnimation(timestamp);
  }

  updateAnimation(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp;
    const deltaTime = timestamp - this.lastFrameTime;

    if (deltaTime <= this.frameInterval || this.images.length === 0) return;

    // EXPLODE: einmal abspielen, dann entfernen
    if (this.state === "explode") {
      if (this.frameIndex >= this.images.length) {
        this.markedForRemoval = true;
        return;
      }
      this.loadImage(this.images[this.frameIndex]);
      this.frameIndex++;
      this.lastFrameTime = timestamp;
      return;
    }

    // FLY: loopen
    const idx = this.frameIndex % this.images.length;
    this.loadImage(this.images[idx]);
    this.frameIndex++;
    this.lastFrameTime = timestamp;
  }

  draw(ctx) {
    ctx.save();
    if (!this.direction) {
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, -this.x - this.width, this.y, this.width, this.height);
    } else {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }

  explode() {
    if (this.state === "explode") return;

    this.state = "explode";
    this.images = this.imageSets[`${this.type}_explode`] || [];
    this.frameIndex = 0;
    this.lastFrameTime = 0;

    // Bewegung stoppen
    this.speed = 0;
  }
}
