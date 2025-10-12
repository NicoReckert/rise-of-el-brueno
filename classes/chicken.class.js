/**
 * Represents a movable non-player character with simple movement and animation behavior.
 * Handles walking, idle, and death states.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    isGameCharacter = true;

    /**
     * Creates a new instance with randomized speed and default animation settings.
     * @param {Object} npcImages - Image data containing animation frames.
     */
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.speed = 0.5 + Math.random() * 0.5;
        this.lastFrameTime = 0;
        this.currentAnimation = 'walk';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
        this.isMovingLeft = true;
        this.isDead = false;
        this.init();
    }

    /**
     * Initializes image sets, size, and offset configuration.
     */
    init() {
        this.walkImages = this.npcImages.chickenMutates_walk || [];
        this.deadImages = this.npcImages.chickenMutates_dead || [];
        this.setSizeAndPosition();
        this.setOffset();
    }

    /**
     * Sets the object's initial size and random position.
     */
    setSizeAndPosition() {
        this.x = 12000 + Math.random() * 2000; // 600
        this.y = 545;
        this.height = 120;
        this.width = 120;
    }

    /**
     * Sets collision or interaction offset values.
     */
    setOffset() {
        this.offset.top = 16;
        this.offset.left = 12;
        this.offset.right = 14;
        this.offset.bottom = 10;
    }

    /**
     * Updates movement and animation each frame.
     */
    updateState() {
        this.handleMovement();
        this.handleAnimation();
    }

    /**
     * Handles movement logic based on direction flags.
     */
    handleMovement() {
        if (this.isMovingLeft) {
            this.isFlipped = false;
            if (this.x > 0) this.x -= this.speed;
        } else if (this.isMovingRight) {
            this.isFlipped = true;
            this.x += this.speed;
        }
    }

    /**
     * Updates the animation state based on movement or death.
     */
    handleAnimation() {
        if (this.isDead) {
            this.playDeathAnimation();
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.currentAnimation = 'walk';
            this.frameInterval = 1000 / 5;
        }
    }

    /**
     * Plays the death animation and adjusts vertical position.
     */
    playDeathAnimation() {
        this.currentAnimation = null;
        this.img = this.deadImages?.[0];
        this.y = 565;
    }

    /**
     * Returns the image set for a given animation state.
     * @param {string} state - The current animation state.
     * @returns {Array<string>|undefined} The corresponding image set.
     */
    getAnimationImages(state) {
        switch (state) {
            case 'walk': return this.walkImages;
        }
    }

    /**
     * Updates the current animation frame based on elapsed time.
     * @param {number} timestamp - Current time in milliseconds.
     */
    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);
            if (images && images.length > 0) {
                this.img = images[this.frameIndex % images.length];
                this.frameIndex++;
                this.lastFrameTime = timestamp;
            }
        }
    }
}
