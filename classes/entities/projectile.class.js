import { MovableObject } from '../systems/movable-object.class.js';
import { getCachedAnimationByConfigKey } from '../../utils/entity-animation-cache.util.js';

/**
 * Movable projectile entity.
 */
export class Projectile extends MovableObject {
  /**
   * Creates a new instance.
   * @param {Object} entityImages Image collection for the projectile.
   * @param {string} type Projectile type.
   * @param {number} x Initial x position.
   * @param {number} y Initial y position.
   * @param {boolean} [direction=true] Movement direction.
   * @param {number} [maxDistance=800] Maximum travel distance.
   */
  constructor(entityImages, type, x, y, direction = true, maxDistance = 800) {
    super();
    this.entityImages = entityImages;
    this.initProjectileCore(type, x, y, direction, maxDistance);
    this.initProjectileStats();
    this.initProjectileAnimation();
  }

  /**
   * Initializes the core projectile properties.
   * @param {string} type Projectile type.
   * @param {number} x Initial x position.
   * @param {number} y Initial y position.
   * @param {boolean} direction Movement direction.
   * @param {number} maxDistance Maximum travel distance.
   * @returns {void}
   */
  initProjectileCore(type, x, y, direction, maxDistance) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.isFlipped = !direction;
    this.startX = x;
    this.maxDistance = maxDistance;
  }

  /**
   * Initializes the projectile statistics.
   * @returns {void}
   */
  initProjectileStats() {
    this.width = 60;
    this.height = 60;
    this.speed = 10;
    this.damage = 2;
    this.isActive = true;
    this.markedForRemoval = false;
  }

  /**
   * Initializes the projectile animation state and cached animation frames.
   */
  initProjectileAnimation() {
    this.currentAnimation = 'idle';
    this.frameInterval = 1000 / 8;
    this.frameIndex = 0;
    this.sheetIndex = 0;
    this.lastFrameTime = 0;
    this.animationFinished = false;
    this.lastUpdateTime = 0;
    const source = this.entityImages?.projectile?.[this.type]?.idleExplodeSheet ?? null;
    this.idleExplodeSheetIdle =
      getCachedAnimationByConfigKey(source, 'projectile', `${this.type}_idle`, 'idle') ?? source;
    this.idleExplodeSheetExplode =
      getCachedAnimationByConfigKey(source, 'projectile', `${this.type}_explode`, 'explode') ?? source;
  }

  /**
   * Retrieves animation frames for the given projectile state.
   * @param {string} [state=this.currentAnimation] Animation state name.
   * @returns {Array|null} Array of animation frames or null if unavailable.
   */
  getAnimationImages(state = this.currentAnimation) {
    if (state === 'explode') {
      return this.idleExplodeSheetExplode ?? null;
    }
    return this.idleExplodeSheetIdle ?? null;
  }

  /**
   * Sets the current animation state.
   * @param {string} newState Animation state.
   * @returns {void}
   */
  setAnimation(newState) {
    if (this.currentAnimation !== newState) {
      this.currentAnimation = newState;
      this.frameIndex = 0;
      this.sheetIndex = 0;
      this.animationFinished = false;
      this.lastFrameTime = null;
    }
  }

  /**
   * Updates the state based on the given timestamp.
   * @param {number} timestamp Frame timestamp.
   * @returns {void}
   */
  updateState(timestamp) {
    this.updateDeltaTime(timestamp);
    if (this.currentAnimation === 'idle') {
      this.updateMovement();
    }
    this.updateAnimation(timestamp);
  }

  /**
   * Updates the animation based on the given timestamp.
   * @param {number} timestamp Frame timestamp.
   * @returns {void}
   */
  updateAnimation(timestamp) {
    this.initLastFrameTime(timestamp);
    if (this.shouldSkipAnimationFrame(timestamp)) return;
    const animSource = this.getCurrentAnimationSource();
    if (!animSource) {
      this.lastFrameTime = timestamp;
      return;
    }
    const loop = this.currentAnimation === 'idle';
    this.updateAnimationFromSourceGeneric(animSource, { allowLoop: loop });
    this.handlePostAnimationState();
    this.lastFrameTime = timestamp;
  }

  /**
   * Initializes the last frame timestamp if not set.
   * @param {number} timestamp Frame timestamp.
   * @returns {void}
   */
  initLastFrameTime(timestamp) {
    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp;
    }
  }

  /**
   * Checks whether the current animation frame should be skipped.
   * @param {number} timestamp Frame timestamp.
   * @returns {boolean} True if the frame should be skipped, otherwise false.
   */
  shouldSkipAnimationFrame(timestamp) {
    const dt = timestamp - this.lastFrameTime;
    return dt <= this.frameInterval;
  }

  /**
   * Returns the current animation source.
   * @returns {Array|null} Animation source or null.
   */
  getCurrentAnimationSource() {
    return this.getAnimationImages(this.currentAnimation);
  }

  /**
   * Handles state updates after the animation has finished.
   * @returns {void}
   */
  handlePostAnimationState() {
    if (this.currentAnimation !== 'explode') return;
    if (!this.animationFinished) return;
    this.markedForRemoval = true;
  }

  /**
   * Updates the projectile movement and checks maximum travel distance.
   * @returns {void}
   */
  updateMovement() {
    const dt = this.deltaTime ?? 1 / 60;
    const step = this.speed * dt * 60;
    this.x += this.direction ? step : -step;
    const traveled = Math.abs(this.x - this.startX);
    if (traveled >= this.maxDistance) {
      this.explode();
    }
  }

  /**
   * Triggers the explode animation and stops movement.
   * @returns {void}
   */
  explode() {
    if (this.currentAnimation === 'explode') return;
    this.setAnimation('explode');
    this.speed = 0;
    if (!this.getAnimationImages('explode')) {
      this.markedForRemoval = true;
    }
  }
}