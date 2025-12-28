/**
 * Represents a large animated movable object with basic movement and animation handling.
 * Used for enemies or boss-like entities.
 * @extends MovableObject
 */
class EndbossAttack extends MovableObject {

    /**
     * Creates a new instance with default position, size, and animation settings.
     * @param {Object} entityImages - Image data containing animation frames.
     */
    constructor(entityImages, allAudios) {
        super();
        this.entityImages = entityImages;
        this.x = 800; // 6200
        this.y = 35;
        this.width = 300;
        this.height = 450;
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 15;
        this.frameIndex = 0;
        this.allAudios = allAudios;

        this.eggs = [];              // NEU
        this.lastEggTime = 0;        // NEU
        this.eggIntervalMin = 2000;  // 2s
        this.eggIntervalRand = 1000; // +0–1s

        this.init();

        this.EGG_SPAWN_ENEMY = {
            small: { type: 'chickenMutatesSmall', w: 120, h: 120, groundY: 545 },
            big: { type: 'chickenMutatesBig', w: 160, h: 160, groundY: 505 },
            tornado: { type: 'tornado', w: 0, h: 0, groundY: 545 }
        };

        this.autoEggs = false;
        this.forcedEnemyType = null;
    }

    /**
     * Initializes image sets used for animations.
     */
    init() {
        this.idleImages = this.entityImages.endbossAttack_idle || [];
    }

    /**
     * Updates movement and animation each frame.
     */
    updateState(timestamp, endboss, setup) {
        this.handleMovement();
        this.handleAnimationState();
        this.updateEggs(timestamp);
        if (this.autoEggs && endboss?.isFly && this.forcedEnemyType) {
            this.trySpawnEgg(timestamp, endboss, setup, this.forcedEnemyType);
        }
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

    trySpawnEgg(timestamp, boss, setup, enemySize = 'small') {
        const nextAllowed = this.lastEggTime + this.eggIntervalMin;
        if (timestamp < nextAllowed) return;

        const extra = Math.random() * this.eggIntervalRand;
        const spawnTime = nextAllowed + extra;

        if (timestamp >= spawnTime) {
            this.spawnEgg(boss, setup, enemySize);
            this.lastEggTime = timestamp;
        }
    }

    spawnEgg(endboss, setup, enemySize = 'small', fallDelayMs = 0, opts = {}) {

        const eggX = endboss.isFlipped ? endboss.x + endboss.width / 2 - 150 : endboss.x + endboss.width / 2 - 50;

        const eggY = endboss.y + endboss.height / 2.5;

        const cfg = this.EGG_SPAWN_ENEMY[enemySize] ?? this.EGG_SPAWN_ENEMY.small;

        const egg = new Egg(this.entityImages, eggX, eggY, this.allAudios, {
            groundY: 520,
            delayMin: fallDelayMs,      // hier schon alt genug, also direkt fallStartTime
            delayMax: fallDelayMs,
            onBreak: (eggInstance) => {
                if (cfg.type === 'tornado') {
                    const t = new EndbossTornado(setup.entityImages, eggInstance.x, eggInstance.y - 200, setup.allAudios);
                    t.world = setup.world;
                    t.setTarget(setup.world.character);
                    t.setBuildTargetX(23500);
                    setup.effects.push(t);
                    return;
                }

                const enemy = new Chicken(
                    cfg.type,
                    setup.entityImages,     // oder images, je nachdem wie du’s nutzt
                    cfg.w,
                    cfg.h,
                    cfg.groundY,
                    eggInstance.x + 60,
                    setup.allAudios
                );
                enemy.world = setup.world;
                setup.townLevel.enemies.push(enemy);
            }
        });

        if (opts.width) egg.width = opts.width;
        if (opts.height) egg.height = opts.height;
        if (opts.groundY) egg.groundY = opts.groundY;

        this.eggs.push(egg);
        return egg;
    }

    updateEggs(timestamp) {
        this.eggs.forEach(e => e.update(timestamp));
        this.eggs = this.eggs.filter(e => !e.isDestroyed);
    }

    spawnPedestalUnder(character) {
        const x = character.x - 40;     // feinjustieren
        const y = 420;                  // podest top
        this.platforms.push(new Pedestal(x, y));
    }


}