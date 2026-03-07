import { MovableObject } from '../systems/movable-object.class.js';

/**
 * Represents a cloud object in the world.
 */
export class Cloud extends MovableObject {
  /**
   * Creates a new instance.
   * @param {Object} [options={}] Configuration options.
   * @param {Array} [options.existingClouds=[]] Existing cloud instances.
   * @param {number} [options.minDistance=200] Minimum distance between clouds.
   * @param {number} [options.levelWidth=6500] Width of the level.
   * @param {*} [options.spriteSheet=null] Optional sprite sheet source.
   * @param {?Object} [options.entityImages=null] Optional image definitions.
   */
  constructor({ existingClouds = [], minDistance = 200, levelWidth = 6500, spriteSheet = null, entityImages = null } = {}) {
    super();
    this.initConfig(existingClouds, minDistance, levelWidth, spriteSheet);
    this.initImages(entityImages);
    this.frameIndex = 0;
    this.cloudVariantIndex = null;
    this.randomizeSizeAndY();
    this.pickRandomSprite();
    this.initMovementState();
  }

  /**
   * Initializes configuration values.
   * @param {Array} existingClouds Existing cloud instances.
   * @param {number} minDistance Minimum distance between clouds.
   * @param {number} levelWidth Width of the level.
   * @param {*} spriteSheet Sprite sheet source.
   */
  initConfig(existingClouds, minDistance, levelWidth, spriteSheet) {
    this.existingClouds = existingClouds;
    this.minDistance = minDistance;
    this.levelWidth = levelWidth;
    this.spriteSheet = spriteSheet;
  }

  /**
   * Initializes cloud image resources.
   * @param {Object} entityImages Image definitions.
   */
  initImages(entityImages) {
    this.cloudImages = entityImages?.cloud?.variants || [];
    this.frameSource = null;
  }

  /**
   * Initializes movement-related state.
   */
  initMovementState() {
    this.speed = 0.3;
    this.x = this.findInitialPosition();
    this.lastUpdateTime = null;
  }

  /**
   * Selects a random sprite for the cloud.
   */
  pickRandomSprite() {
    const sheet = this.spriteSheet;
    if (this.tryPickSpriteFromSheet(sheet)) return;
    if (this.tryPickSpriteFromImages()) return;
    this.resetSpriteSelection();
  }

  /**
   * Attempts to select a sprite from a sprite sheet.
   * @param {*} sheet Sprite sheet data.
   * @returns {boolean} True if selection was successful, otherwise false.
   */
  tryPickSpriteFromSheet(sheet) {
    if (!sheet?.meta || !sheet?.image) return false;
    const def = this.getSheetAnimDef(sheet);
    const range = this.getSheetFrameRange(def, sheet.meta);
    if (!range.count || range.count < 1) return false;
    this.frameIndex = Math.floor(Math.random() * range.count);
    this.applyNextSheetFrame(sheet);
    this.cloudVariantIndex = null;
    return true;
  }

  /**
   * Attempts to select a sprite from available images.
   * @returns {boolean} True if selection was successful, otherwise false.
   */
  tryPickSpriteFromImages() {
    if (!this.cloudImages.length) return false;
    this.cloudVariantIndex = Math.floor(
      Math.random() * this.cloudImages.length
    );
    this.img = this.cloudImages[this.cloudVariantIndex];
    this.frameSource = null;
    return true;
  }

  /**
   * Resets sprite selection state.
   */
  resetSpriteSelection() {
    this.img = null;
    this.frameSource = null;
    this.cloudVariantIndex = null;
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
}