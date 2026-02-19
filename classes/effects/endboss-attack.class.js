import { MovableObject } from '../systems/movable-object.class.js';
import { Enemy } from '../entities/enemy.class.js';
import { EndbossTornado } from './endboss-tornado.class.js';
import { Egg } from '../entities/egg.class.js';

/**
 * Represents an endboss attack entity.
 */
export class EndbossAttack extends MovableObject {
    /**
    * Creates a new instance.
    * @param {*} entityImages Image resources.
    * @param {*} allAudios Audio resources.
    * @param {*} world World reference.
    */
    constructor(entityImages, allAudios, world) {
        super();
        this.world = world;
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        this.initBaseDimensions();
        this.initAnimationState();
        this.initEggSystem();
        this.initEggSpawnConfig();
        this.init();
    }

    /**
    * Initializes base dimensions and position.
    */
    initBaseDimensions() {
        this.x = 800;
        this.y = 35;
        this.width = 300;
        this.height = 450;
    }

    /**
    * Initializes animation state.
    */
    initAnimationState() {
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 15;
        this.frameIndex = 0;
    }

    /**
    * Initializes the egg system.
    */
    initEggSystem() {
        this.eggs = [];
        this.lastEggTime = 0;
        this.eggIntervalMin = 2000;
        this.eggIntervalRand = 1000;
        this.autoEggs = false;
        this.forcedEnemyType = null;
    }

    /**
    * Initializes egg spawn configuration.
    */
    initEggSpawnConfig() {
        this.EGG_SPAWN_ENEMY = {
            small: { type: 'chickenMutatesSmall', w: 120, h: 120, groundY: 545 },
            big: { type: 'chickenMutatesBig', w: 160, h: 160, groundY: 505 },
            tornado: { type: 'tornado', w: 0, h: 0, groundY: 545 }
        };
    }

    /**
    * Initializes resources.
    */
    init() {
        this.idleImages = this.entityImages.endbossAttack_idle || [];
    }

    /**
    * Updates the attack state.
    * @param {number} timestamp Current frame timestamp.
    * @param {*} endboss Endboss reference.
    * @param {*} setup Configuration object.
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
    * Handles movement based on current direction flags.
    */
    handleMovement() {
        if (this.isMovingLeft) {
            this.moveLeft();
        } else if (this.isMovingRight) {
            this.moveRight();
        }
    }

    /**
    * Updates the animation state based on movement.
    */
    handleAnimationState() {
        if (this.isMovingLeft || this.isMovingRight) {
            this.setAnimation('walk', 8);
        } else {
            this.setAnimation('idle', 15);
        }
    }

    /**
    * Moves the entity to the left.
    */
    moveLeft() {
        this.isFlipped = false;
        if (this.x > 0) {
            this.x -= this.speedX;
        }
    }

    /**
    * Moves the entity to the right.
    */
    moveRight() {
        this.isFlipped = true;
        this.x += this.speedX;
    }

    /**
    * Sets the current animation.
    * @param {string} name Animation name.
    * @param {number} fps Frames per second.
    */
    setAnimation(name, fps) {
        this.currentAnimation = name;
        this.frameInterval = 1000 / fps;
    }

    /**
    * Returns animation images for a given state.
    * @param {string} state Animation state.
    * @returns {Array|undefined} List of images or undefined.
    */
    getAnimationImages(state) {
        switch (state) {
            case 'idle': return this.idleImages;
        }
    }

    /**
    * Updates the animation frame.
    * @param {number} timestamp Current frame timestamp.
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

    /**
    * Attempts to spawn an egg.
    * @param {number} timestamp Current frame timestamp.
    * @param {*} boss Endboss reference.
    * @param {*} setup Configuration object.
    * @param {string} [enemySize='small'] Enemy size type.
    */
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

    /**
    * Spawns an egg.
    * @param {*} endboss Endboss reference.
    * @param {*} setup Configuration object.
    * @param {string} [enemySize='small'] Enemy size type.
    * @param {number} [fallDelayMs=0] Fall delay in milliseconds.
    * @param {Object} [opts={}] Additional options.
    * @returns {*} Spawned egg instance.
    */
    spawnEgg(endboss, setup, enemySize = 'small', fallDelayMs = 0, opts = {}) {
        const eggPos = this.getEggSpawnPosition(endboss);
        const cfg = this.getEggConfig(enemySize);
        const egg = this.createEgg(eggPos, cfg, fallDelayMs, setup);
        this.applyEggOptions(egg, opts);
        this.eggs.push(egg);
        return egg;
    }

    /**
    * Calculates the egg spawn position.
    * @param {{x: number, y: number, width: number, height: number, isFlipped: boolean}} endboss Endboss data.
    * @returns {{x: number, y: number}} Spawn position.
    */
    getEggSpawnPosition(endboss) {
        const offset = endboss.isFlipped ? -150 : -50;
        const x = endboss.x + endboss.width / 2 + offset;
        const y = endboss.y + endboss.height / 2.5;
        return { x, y };
    }

    /**
    * Returns the egg configuration for a given enemy size.
    * @param {string} enemySize Enemy size type.
    * @returns {{type: string, w: number, h: number, groundY: number}} Egg configuration.
    */
    getEggConfig(enemySize) {
        return this.EGG_SPAWN_ENEMY[enemySize] ?? this.EGG_SPAWN_ENEMY.small;
    }

    /**
    * Creates an egg instance.
    * @param {{x: number, y: number}} eggPos Spawn position.
    * @param {{type: string, w: number, h: number, groundY: number}} cfg Egg configuration.
    * @param {number} fallDelayMs Fall delay in milliseconds.
    * @param {*} setup Configuration object.
    * @returns {*} Egg instance.
    */
    createEgg(eggPos, cfg, fallDelayMs, setup) {
        return new Egg(
            this.entityImages,
            eggPos.x,
            eggPos.y,
            this.allAudios,
            {
                groundY: 520,
                delayMin: fallDelayMs,
                delayMax: fallDelayMs,
                onBreak: eggInstance => this.handleEggBreak(cfg, eggInstance, setup)
            }
        );
    }

    /**
    * Handles egg break behavior.
    * @param {{type: string, w: number, h: number, groundY: number}} cfg Egg configuration.
    * @param {*} eggInstance Egg instance.
    * @param {*} setup Configuration object.
    */
    handleEggBreak(cfg, eggInstance, setup) {
        if (cfg.type === 'tornado') {
            this.spawnTornadoFromEgg(eggInstance, setup);
            return;
        }
        const enemy = this.createEnemyFromEgg(cfg, eggInstance, setup);
        setup.townLevel.enemies.push(enemy);
    }

    /**
    * Spawns a tornado from a broken egg.
    * @param {*} eggInstance Egg instance.
    * @param {*} setup Configuration object.
    */
    spawnTornadoFromEgg(eggInstance, setup) {
        const tornado = new EndbossTornado(
            setup.entityImages,
            eggInstance.x,
            eggInstance.y - 200,
            setup.allAudios
        );
        tornado.world = setup.world;
        tornado.setTarget(setup.world.character);
        tornado.setBuildTargetX(23380);
        setup.world.tornado = tornado;
        setup.effects.push(tornado);
    }

    /**
    * Creates an enemy from a broken egg.
    * @param {{type: string, w: number, h: number, groundY: number}} cfg Egg configuration.
    * @param {*} eggInstance Egg instance.
    * @param {*} setup Configuration object.
    * @returns {*} Enemy instance.
    */
    createEnemyFromEgg(cfg, eggInstance, setup) {
        return new Enemy(
            cfg.type,
            setup.entityImages,
            cfg.w,
            cfg.h,
            cfg.groundY,
            eggInstance.x + 60,
            setup.allAudios,
            this.world
        );
    }

    /**
    * Applies additional options to an egg instance.
    * @param {*} egg Egg instance.
    * @param {{width?: number, height?: number, groundY?: number}} opts Optional settings.
    */
    applyEggOptions(egg, opts) {
        if (opts.width) egg.width = opts.width;
        if (opts.height) egg.height = opts.height;
        if (opts.groundY) egg.groundY = opts.groundY;
    }

    /**
    * Updates all eggs and removes destroyed ones.
    * @param {number} timestamp Current frame timestamp.
    */
    updateEggs(timestamp) {
        this.eggs.forEach(e => e.update(timestamp));
        this.eggs = this.eggs.filter(e => !e.isDestroyed);
    }

    /**
    * Spawns a pedestal under a character.
    * @param {{x: number}} character Character reference.
    */
    spawnPedestalUnder(character) {
        const x = character.x - 40;
        const y = 420;
        this.platforms.push(new Pedestal(x, y));
    }
}