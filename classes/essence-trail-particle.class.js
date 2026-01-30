import { MovableObject } from './movable-object.class.js';

export class EssenceTrailParticle extends MovableObject {
  constructor(img, x, y) {
    super();
    this.img = img;         // Image-Objekt (z.B. Essence Frame)
    this.x = x;
    this.y = y;
    this.width = 18;
    this.height = 18;

    this.opacity = 0.6;
    this.life = 260;        // ms
    this.birth = null;

    // mini drift
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;

    this.isFinished = false;
  }

  updateState(timestamp) {
    if (!this.birth) this.birth = timestamp;
    const t = timestamp - this.birth;

    this.x += this.vx;
    this.y += this.vy;

    const p = Math.min(1, t / this.life);
    this.opacity = 0.6 * (1 - p);

    if (p >= 1) this.isFinished = true;
  }
}