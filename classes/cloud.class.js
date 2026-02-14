import { MovableObject } from './movable-object.class.js';

/**
 * Represents a cloud object within the level.
 */
export class Cloud extends MovableObject {
  /**
  * Creates a new cloud instance.
  * @param {Array<Object>} [existingClouds=[]] Existing clouds for distance checks.
  * @param {number} [minDistance=200] Minimum horizontal distance to other clouds.
  * @param {number} [levelWidth=6500] Width of the level.
  * @param {*} [spriteSheet=null] Sprite sheet reference.
  */
  constructor(existingClouds = [], minDistance = 200, levelWidth = 6500, spriteSheet = null) {
    super();
    this.existingClouds = existingClouds;
    this.minDistance = minDistance;
    this.levelWidth = levelWidth;
    this.spriteSheet = spriteSheet;
    this.frameSource = null;
    this.randomizeSizeAndY();
    this.pickRandomSprite();
    this.speed = 0.3;
    this.x = this.findInitialPosition();
    this.lastUpdateTime = null;
  }

  /**
  * Selects and applies a random cloud sprite.
  */
  pickRandomSprite() {
    if (this.spriteSheet && this.spriteSheet.meta && this.spriteSheet.image) {
      const ok = this.applyStaticSheetFrame(this.spriteSheet);
      if (ok) return;
    }
    const cloudVariant = Math.random() < 0.5 ? '1' : '2';
    this.loadImage(`./assets/img/5_background/layers/4_clouds/${cloudVariant}.webp`);
    this.frameSource = null;
  }

  /**
  * Randomizes cloud size and vertical position.
  */
  randomizeSizeAndY() {
    this.y = 50 + Math.random() * 50;
    this.width = 300 + Math.random() * 200;
    this.height = 150 + Math.random() * 100;
  }

  /**
  * Determines the initial horizontal position of the cloud.
  * @returns {number}
  */
  findInitialPosition() {
    const clouds = this.existingClouds || [];
    if (!clouds.length) {
      return Math.random() * this.levelWidth;
    }
    return this.findValidPosition(clouds, this.minDistance);
  }

  /**
  * Finds a valid horizontal position respecting minimum distance.
  * @param {Array<Object>} existingClouds Existing clouds.
  * @param {number} minDistance Minimum horizontal distance.
  * @param {number} [maxTries=40] Maximum random attempts.
  * @returns {number}
  */
  findValidPosition(existingClouds, minDistance, maxTries = 40) {
    const candidate = this.tryFindRandomPosition(existingClouds, minDistance, maxTries);
    if (candidate != null) {
      return candidate;
    }
    return this.getFallbackPosition(existingClouds, minDistance);
  }

  /**
  * Tries to find a random valid horizontal position.
  * @param {Array<Object>} existingClouds Existing clouds.
  * @param {number} minDistance Minimum horizontal distance.
  * @param {number} maxTries Maximum random attempts.
  * @returns {number|null}
  */
  tryFindRandomPosition(existingClouds, minDistance, maxTries) {
    let currentMin = minDistance;
    for (let i = 0; i < maxTries; i++) {
      const candidateX = Math.random() * this.levelWidth;
      if (existingClouds.every(c => this.isFarEnough(candidateX, c, currentMin))) {
        return candidateX;
      }
      if ((i + 1) % 10 === 0 && currentMin > 30) {
        currentMin *= 0.8;
      }
    }
    return null;
  }

  /**
  * Calculates a fallback horizontal position.
  * @param {Array<Object>} existingClouds Existing clouds.
  * @param {number} minDistance Minimum horizontal distance.
  * @returns {number}
  */
  getFallbackPosition(existingClouds, minDistance) {
    if (existingClouds.length > 0) {
      const rightMost = Math.max(...existingClouds.map(c => c.x + c.width));
      return rightMost + minDistance;
    }
    return Math.random() * this.levelWidth;
  }

  /**
  * Checks whether a position keeps sufficient distance from another cloud.
  * @param {number} candidateX Proposed horizontal position.
  * @param {Object} other Other cloud instance.
  * @param {number} minDistance Minimum horizontal distance.
  * @returns {boolean}
  */
  isFarEnough(candidateX, other, minDistance) {
    return (
      candidateX + this.width + minDistance < other.x ||
      candidateX > other.x + other.width + minDistance
    );
  }

  /**
  * Respawns the cloud at a new valid position.
  */
  respawn() {
    this.randomizeSizeAndY();
    this.pickRandomSprite();
    const others = (this.existingClouds || []).filter(c => c !== this);
    if (!others.length) {
      this.x = this.levelWidth + Math.random() * this.levelWidth;
      return;
    }
    const rightMost = Math.max(...others.map(c => c.x + c.width));
    this.x = rightMost + this.minDistance + Math.random() * 100;
  }

  /**
  * Updates cloud position based on elapsed time.
  * @param {number} timestamp Current animation frame timestamp.
  */
  update(timestamp) {
    if (this.lastUpdateTime == null) {
      this.lastUpdateTime = timestamp;
      return;
    }
    const deltaTime = timestamp - this.lastUpdateTime;
    this.lastUpdateTime = timestamp;
    this.x -= this.speed * (deltaTime / (1000 / 60));
    if (this.x <= -this.width) {
      this.respawn();
    }
  }

  /**
  * Applies a static frame from a sprite sheet.
  * @param {Object} sheet Sprite sheet configuration.
  * @returns {boolean}
  */
  applyStaticSheetFrame(sheet) {
    const { image, meta, anim } = sheet || {};
    if (!image || !meta) return false;
    const animName = anim ?? 'idle';
    const def =
      meta.animations?.[animName] ??
      meta.animations?.default ??
      null;
    const from = def?.from ?? 0;
    const frame = from;
    return this.setFrameFromSheetMeta(image, meta, frame);
  }
}