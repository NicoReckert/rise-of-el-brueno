/**
 * Represents a complex movable object with gravity, animation, and state handling.
 * Handles movement, jumping, falling, and transitions between animation states.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    isGameCharacter = true;

    /**
     * Creates a new instance with default position, speed, and animation settings.
     * @param {Object} npcImages - Image data containing animation frames.
     */
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.speedX = 8;
        this.speedY = 0;
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
        this.gravityInterval = 1000 / 60;
        this.init();
    }

    /**
     * Initializes object size, offsets, images, and states.
     */
    init() {
        this.setSizeAndPosition();
        this.setOffset();
        this.initBaseImages();
        this.initStates();
    }

    /**
     * Sets the initial size and position.
     */
    setSizeAndPosition() {
        this.x = 16000;
        this.y = 205;
        this.width = 350;
        this.height = 500;
    }

    /**
     * Sets collision or interaction offset values.
     */
    setOffset() {
        this.offset.top = 98;
        this.offset.left = 15;
        this.offset.right = 13;
        this.offset.bottom = 14;
    }

    /**
     * Initializes base image sets.
     */
    initBaseImages() {
        this.idleImages = this.npcImages.endboss_idle || [];
        this.walkImages = this.npcImages.endboss_walk || [];
        this.deadImages = this.npcImages.endboss_dead || [];
        this.hurtImages = this.npcImages.endboss_hurt || [];
        this.findsPeaceImages = this.npcImages.endboss_findsPeace || [];
    }

    /**
     * Initializes state flags.
     */
    initStates() {
        this.isHurt = false;
        this.isDead = false;
        this.isDeadAnimationReady = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isJumping = false;
        this.isUnderTheGround = false;
        this.isFindsPeace = false;
    }

    /**
     * Applies gravity by updating the vertical position over time.
     * @param {number} timestamp - Current time in milliseconds.
     */
    applyGravityBoss(timestamp) {
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;
        const deltaTime = timestamp - this.lastGravityUpdate;
        if (deltaTime <= this.gravityInterval) return;
        this.updateVerticalPosition();
        this.lastGravityUpdate = timestamp;
    }

    /**
     * Updates the vertical position based on gravity and collisions.
     */
    updateVerticalPosition() {
        if (this.shouldApplyGravity()) {
            this.applyJumpPhysics();
            this.checkGroundCollision();
        } else {
            this.resetVerticalMovement();
        }
    }

    /**
     * Determines whether gravity should currently be applied.
     * @returns {boolean} True if gravity should be applied.
     */
    shouldApplyGravity() {
        return this.isJumping || this.y < -35 || this.speedY > 0;
    }

    /**
     * Applies basic jump physics.
     */
    applyJumpPhysics() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Checks for ground collision and resets vertical movement if necessary.
     */
    checkGroundCollision() {
        if (this.y >= -35) {
            this.y = -35;
            this.speedY = 0;
            this.isJumping = false;
        }
    }

    /**
     * Resets vertical movement and jump state.
     */
    resetVerticalMovement() {
        this.speedY = 0;
        this.isJumping = false;
    }

    /**
     * Moves the object downward after death until it goes below the ground level.
     * @param {number} timestamp - Current time in milliseconds.
     */
    moveDownAfterDead(timestamp) {
        if (!this.lastMoveDownTime) this.lastMoveDownTime = timestamp;
        const deltaTime = timestamp - this.lastMoveDownTime;
        if (deltaTime <= 1000 / 60) return;
        if (this.isDead && !this.isUnderTheGround) {
            this.y += this.fallSpeed || 5;
            if (this.y > 600) {
                this.isUnderTheGround = true;
            }
        }
        this.lastMoveDownTime = timestamp;
    }

    /**
     * Updates movement and animation state each frame.
     */
    updateState() {
        this.updateDeltaTime(timestamp);
        this.handleMovement();
        this.handleStateAnimations();
    }

    /**
     * Updates delta time and calculates movement speed.
     * @param {number} timestamp - Current time in milliseconds.
     */
    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        const deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
        this.movementSpeed = this.speedX * deltaTime * 60;
    }

    /**
     * Handles horizontal movement based on direction flags.
     */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.isFlipped = false;
        if (this.x > 0) {
            this.x -= this.movementSpeed;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.isFlipped = true;
        this.x += this.movementSpeed;
    }

    /**
     * Handles and updates the animation state based on current conditions.
     */
    handleStateAnimations() {
        if (this.isFindsPeace) return this.playFindsPeace();
        if (this.isDead) return this.playDeathAnimation();
        if (this.isHurt) return this.playHurtAnimation();
        if (this.isJumping) return this.setAnimation('jump', 10);
        if (this.isMovingLeft || this.isMovingRight)
            return this.setAnimation('walk', 8);
        this.setAnimation('idle', 8);
    }

    /**
     * Plays the "finds peace" animation and resets the state when finished.
     */
    playFindsPeace() {
        this.setAnimation('findsPeace', 6);
        if (this.frameIndex >= this.findsPeaceImages.length) {
            this.isFindsPeace = false;
            this.frameIndex = 0;
        }
    }

    /**
     * Plays the death animation and stops it when finished.
     */
    playDeathAnimation() {
        if (!this.isDeadAnimationReady) {
            this.setAnimation('dead', 4);
        } else {
            this.currentAnimation = null;
        }
    }

    /**
     * Plays the hurt animation and resets the state when finished.
     */
    playHurtAnimation() {
        this.setAnimation('hurt', 8);
        if (this.frameIndex >= this.hurtImages.length) {
            this.isHurt = false;
            this.frameIndex = 0;
        }
    }

    /**
     * Sets the current animation and adjusts its frame rate.
     * @param {string} name - Animation name.
     * @param {number} fps - Frames per second.
     */
    setAnimation(name, fps) {
        this.currentAnimation = name;
        this.frameInterval = 1000 / fps;
    }

    /**
     * Returns the image set for a given animation state.
     * @param {string} state - Animation state name.
     * @returns {Array<string>|undefined} The corresponding image set.
     */
    getAnimationImages(state) {
        switch (state) {
            case 'dead': return this.deadImages;
            case 'hurt': return this.hurtImages;
            case 'jump': return this.jumpImages;
            case 'walk': return this.walkImages;
            case 'findsPeace': return this.findsPeaceImages;
            case 'idle': return this.idleImages;
        }
    }

    /**
     * Updates the animation frame based on elapsed time.
     * @param {number} timestamp - Current time in milliseconds.
     */
    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime <= this.frameInterval) return;
        this.updateFrameImage();
        this.handleDeathAnimation();
        this.lastFrameTime = timestamp;
    }

    /**
     * Updates the currently displayed animation frame.
     */
    updateFrameImage() {
        const images = this.getAnimationImages(this.currentAnimation);
        if (!images || images.length === 0) return;
        this.img = images[this.frameIndex % images.length];
        this.frameIndex++;
    }

    /**
     * Handles logic for death animation progression and final frame handling.
     */
    handleDeathAnimation() {
        if (this.currentAnimation !== 'dead') return;
        if (this.frameIndex < this.deadImages.length) return;
        this.isDeadAnimationReady = true;
        this.frameIndex = 0;
        this.img = this.deadImages[7];
    }
}