/**
 * Represents a large animated movable object with basic movement and animation handling.
 * Used for enemies or boss-like entities.
 * @extends MovableObject
 */
class EndbossAttack extends MovableObject {

    /**
     * Creates a new instance with default position, size, and animation settings.
     * @param {Object} npcImages - Image data containing animation frames.
     */
    constructor(npcImages) {
        super();
        this.npcImages = npcImages;
        this.x = 800; // 6200
        this.y = 35;
        this.width = 300;
        this.height = 450;
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 15;
        this.frameIndex = 0;
        this.init();
    }

    /**
     * Initializes image sets used for animations.
     */
    init() {
        this.idleImages = this.npcImages.endbossAttack_idle || [];
    }

    /**
     * Updates movement and animation each frame.
     */
    updateState() {
        this.handleMovement();
        this.handleAnimationState();
    }

    /**
     * Handles horizontal movement based on direction flags.
     */
    handleMovement() {
        if (this.isMovingLeft) {
            this.moveLeft();
        } else if (this.isMovingRight) {
            this.moveRight();
        }
    }

    /**
     * Updates the animation state based on current movement.
     */
    handleAnimationState() {
        if (this.isMovingLeft || this.isMovingRight) {
            this.setAnimation('walk', 8);
        } else {
            this.setAnimation('idle', 15);
        }
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.isFlipped = false;
        if (this.x > 0) {
            this.x -= this.speedX;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.isFlipped = true;
        this.x += this.speedX;
    }

    /**
     * Sets the current animation and its playback speed.
     * @param {string} name - Animation name.
     * @param {number} fps - Frames per second.
     */
    setAnimation(name, fps) {
        this.currentAnimation = name;
        this.frameInterval = 1000 / fps;
    }

    /**
     * Returns the image set for the given animation state.
     * @param {string} state - The current animation state.
     * @returns {Array<string>|undefined} The corresponding image set.
     */
    getAnimationImages(state) {
        switch (state) {
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