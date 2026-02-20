import { MovableObject } from '../systems/movable-object.class.js';
/**
 * Represents a particle used for an essence trail effect.
 */
export class EssenceTrailParticle extends MovableObject {
  /**
  * Creates a new instance.
  * @param {*} img Image source.
  * @param {number} x Initial x-coordinate.
  * @param {number} y Initial y-coordinate.
  */
  constructor(img, x, y) {
    super();
    this.initBaseProperties(img, x, y);
    this.initRandomVelocity();
  }

  /**
  * Initializes base properties for the particle.
  * @param {*} img Image source.
  * @param {number} x Initial x-coordinate.
  * @param {number} y Initial y-coordinate.
  */
  initBaseProperties(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = 18;
    this.height = 18;
    this.opacity = 0.6;
    this.life = 260;
    this.birth = null;
    this.isFinished = false;
  }

  /**
  * Initializes a random velocity for the particle.
  */
  initRandomVelocity() {
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
  }

  /**
  * Updates the particle state.
  * @param {number} timestamp Frame timestamp.
  */
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