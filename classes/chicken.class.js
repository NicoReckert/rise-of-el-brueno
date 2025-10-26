/**
 * Represents a movable non-player character with simple movement and animation behavior.
 * Handles walking, idle, and death states.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    isGameCharacter = true;

    /**
     * Creates a new instance with randomized speed and default animation settings.
     * @param {Object} entityImages - Image data containing animation frames.
     */
    constructor(currentEnemy, entityImages, width = 120, height = 120, y = 545, allAudios) {
        super();
        this.currentEnemy = currentEnemy;
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        this.speed = 0.5 + Math.random() * 0.5;
        this.lastFrameTime = 0;
        this.currentAnimation = 'walk';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
        this.isMovingLeft = true;
        this.isDead = false;
        this.isHurt = false;
        this.isAttack = false;
        this.health = 3;
        this.init(this.currentEnemy);
        this.speedX = 0;
        this.knockbackActive = false;
        this.acceleration = 1.5;

        this.y = y;
        this.spawnY = y
        this.height = height;
        this.width = width;
        this.attackOnCooldown = false;
    }

    /**
     * Initializes image sets, size, and offset configuration.
     */
    init(currentEnemy) {
        this.walkImages = this.entityImages[currentEnemy]?.walk || [];
        this.hurtImages = this.entityImages[currentEnemy]?.hurt || [];
        this.deadImages = this.entityImages[currentEnemy]?.dead || [];
        this.attackImages = this.entityImages[currentEnemy]?.attack || []
        this.setSizeAndPosition();
        this.setOffset();
    }

    /**
     * Sets the object's initial size and random position.
     */
    setSizeAndPosition() {
        this.x = 12000 + Math.random() * 2000; // 600
        // this.y = 545;
        // this.height = 120;
        // this.width = 120;
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
    updateState(timestamp) {
        this.applyGravity3(timestamp);

        // Knockback-Bewegung aktiv
        if (this.knockbackActive) {
            this.x += this.speedX;
            this.speedX *= 0.85; // Reibung, verlangsamt
            if (Math.abs(this.speedX) < 0.5) {
                this.speedX = 0;
            }
        } else {
            // normale Bewegung
            this.handleMovement();
        }

        this.handleAnimation();
        if (!this.isDead && !this.isGravity && !this.knockbackActive) {
    const diff = this.y - this.spawnY;
    if (Math.abs(diff) > 0.5) {
        this.y = this.spawnY;
    }
}

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
        } else if (this.isAttack) {
            this.currentAnimation = 'attack';
            this.frameInterval = 1000 / 5;
        } else if (this.isHurt) {
            this.currentAnimation = 'hurt';
            this.frameInterval = 1000 / 5;
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
            case 'hurt': return this.hurtImages;
            case 'attack': return this.attackImages;
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

                if (this.isAttack && this.currentEnemy === "chickenMutatesBig") {
                    if (this.isHurt || this.isDead) return;
                    const shootFrame = 8; // z.B. Mitte der Animation
                    if (this.frameIndex === shootFrame && !this.hasFiredThisAttack) {
                        const audio = this.allAudios.fireballShotSound.cloneNode();
                        audio.play();
                        this.shootProjectile("fireball", this.world.character);
                        this.hasFiredThisAttack = true;
                    }

                    if (this.frameIndex >= images.length - 1) {
                        this.hasFiredThisAttack = false;
                        this.isAttack = false;
                        this.frameIndex = 0;
                    }
                }

                this.frameIndex++;
                this.lastFrameTime = timestamp;
            }
        }
    }

    applyGravity3() {
    if (!this.isGravity) return;

    const groundY = this.spawnY;

    this.y -= this.speedY;
    this.speedY -= this.acceleration;

    // ✨ Stabiler Boden-Check
    if (this.y >= groundY) {
        this.y = groundY;
        this.speedY = 0;
        this.isGravity = false;
        this.knockbackActive = false;
    }
}


    shootProjectile(type, character) {
        const direction = character.x > this.x;
        const offsetX = direction ? this.width - 25 : -45;
        const offsetY = this.y + this.height * 0.22; // aus dem Schnabel

        const projectile = new Projectile(type, this.x + offsetX, offsetY, direction);
        if (!this.world.projectiles) this.world.projectiles = [];
        this.world.projectiles.push(projectile);
    }

}
