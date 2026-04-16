import { Projectile } from '../entities/projectile.class.js';

/**
 * Represents an endboss fireball projectile.
 */
export class EndbossFireball extends Projectile {
    /**
     * Creates a fireball projectile instance.
     * @param {Object} entityImages Entity images.
     * @param {number} startX Start x position.
     * @param {number} startY Start y position.
     * @param {number} targetX Target x position.
     * @param {number} targetY Target y position.
     * @param {Object} allAudios Audio resources.
     * @returns {void}
     */
    constructor(entityImages, startX, startY, targetX, targetY, allAudios) {
        const direction = targetX >= startX;
        super(entityImages, "fireball", startX, startY, direction, 800, {
            width: 180,
            height: 180,
            damage: 4
        });
        this.initCore(allAudios);
        this.initVelocity(startX, startY, targetX, targetY);
        this.world = null;
    }

    /**
     * Initializes core projectile properties.
     * @param {Object} allAudios Audio resources.
     * @returns {void}
     */
    initCore(allAudios) {
        this.allAudios = allAudios;
    }

    /**
     * Initializes velocity towards a target position.
     * @param {number} startX Start x position.
     * @param {number} startY Start y position.
     * @param {number} targetX Target x position.
     * @param {number} targetY Target y position.
     */
    initVelocity(startX, startY, targetX, targetY) {
        const speed = 14;
        const dx = targetX - startX;
        const dy = targetY - startY;
        const len = Math.hypot(dx, dy) || 1;
        this.vx = (dx / len) * speed;
        this.vy = (dy / len) * speed;
    }

    /**
     * Updates the fireball state.
     * @param {number} timestamp Current frame timestamp.
     */
    updateState(timestamp) {
        if (this.markedForRemoval) return;
        this.updateDeltaTime(timestamp);
        if (this.currentAnimation === "explode") {
            this.updateAnimation(timestamp);
            return;
        }
        const step = this.getMovementStep();
        this.updatePosition(step);
        this.updateDirection();
        if (this.handleCharacterCollision(timestamp)) return;
        if (this.handleGroundCollision()) return;
        this.updateAnimation(timestamp);
    }

    /**
     * Calculates the movement step factor.
     * @returns {number} Movement step multiplier.
     */
    getMovementStep() {
        const defaultDt = 1 / 60;
        const dt = this.deltaTime ?? defaultDt;
        return dt * 60;
    }

    /**
     * Updates the projectile position.
     * @param {number} step Movement step multiplier.
     */
    updatePosition(step) {
        this.x += this.vx * step;
        this.y += this.vy * step;
    }

    /**
     * Updates the projectile direction.
     */
    updateDirection() {
        this.direction = this.vx >= 0;
    }

    /**
     * Handles collision with the character.
     * @param {number} timestamp Current frame timestamp.
     * @returns {boolean} True if a collision occurred, otherwise false.
     */
    handleCharacterCollision(timestamp) {
        const character = this.world?.character;
        if (!character) return false;
        if (!this.isCharacterHit(character)) return false;
        this.applyCharacterHitDamage(character, timestamp);
        this.explode();
        return true;
    }

    /**
     * Checks whether the projectile hits the character.
     * @param {*} character Character reference.
     * @returns {boolean} True if hit, otherwise false.
     */
    isCharacterHit(character) {
        const baseOffset = { x: 0, width: 0 };
        const extendedOffset = { x: 50, width: 50 };
        return this.isColliding(character, baseOffset, extendedOffset);
    }

    /**
     * Applies hit damage to a character and updates the character bar.
     * @param {Object} character Character object.
     * @param {number} timestamp Current timestamp.
     * @returns {void}
     */
    applyCharacterHitDamage(character, timestamp) {
        const damage = character.isProtect ? 2 : 10;
        const ctrl = character.combatCtrl;
        if (typeof ctrl?.hit === "function") {
            ctrl.hit(timestamp, damage);
        } else if ("energy" in character) {
            character.energy -= damage;
        }
        this.updateCharacterBar(character);
    }

    /**
     * Updates the character status bar.
     * @param {Object} character Character object.
     * @returns {void}
     */
    updateCharacterBar(character) {
        const statusBar =
            this.world?.getCurrentSetup?.()?.statusBarCharacter
            ?? this.world?.townLevelSetup?.statusBarCharacter;
        statusBar?.setPercentage(character.energy);
    }

    /**
     * Handles collision with the ground.
     * @returns {boolean} True if a collision occurred, otherwise false.
     */
    handleGroundCollision() {
        const defaultGroundY = 700;
        const groundY = this.world?.groundY ?? defaultGroundY;
        if (this.y + this.height < groundY) return false;
        this.y = groundY - this.height;
        this.explode();
        return true;
    }

    /**
     * Triggers the explosion state.
     */
    explode() {
        if (this.currentAnimation === "explode") return;
        if (this.allAudios?.explodeSfx) {
            const audio = this.allAudios.explodeSfx.cloneNode();
            audio.volume = 0.9;
            audio.play();
        }
        super.explode();
        this.vx = 0;
        this.vy = 0;
    }
}