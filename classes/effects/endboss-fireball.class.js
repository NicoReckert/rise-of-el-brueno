import { Projectile } from '../entities/projectile.class.js';

/**
 * Represents an endboss fireball projectile.
 */
export class EndbossFireball extends Projectile {
    /**
    * Creates a new instance.
    * @param {number} startX Start x position.
    * @param {number} startY Start y position.
    * @param {number} targetX Target x position.
    * @param {number} targetY Target y position.
    * @param {*} allAudios Audio resources.
    */
    constructor(startX, startY, targetX, targetY, allAudios) {
        const direction = targetX >= startX;
        super("fireball", startX, startY, direction);
        this.initCore(allAudios);
        this.initVelocity(startX, startY, targetX, targetY);
        this.world = null;
    }

    /**
    * Initializes core properties.
    * @param {*} allAudios Audio resources.
    */
    initCore(allAudios) {
        this.allAudios = allAudios;
        this.width = 180;
        this.height = 180;
        this.damage = 4;
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
        if (this.state === "explode") {
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
    * Applies damage to the character.
    * @param {*} character Character reference.
    * @param {number} timestamp Current frame timestamp.
    */
    applyCharacterHitDamage(character, timestamp) {
        const ctrl = character.combatCtrl;
        if (typeof ctrl.hit === "function") {
            ctrl.hit(timestamp, this.damage);
        } else if (typeof ctrl.hit === "function") {
            ctrl.hit(this.damage);
        } else if ("health" in character) {
            character.health -= this.damage;
        }
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
        if (this.state === "explode") return;
        if (this.allAudios?.explodeSound) {
            const audio = this.allAudios.explodeSound.cloneNode();
            audio.volume = 0.9;
            audio.play();
        }
        super.explode();
        this.vx = 0;
        this.vy = 0;
    }

    /**
    * Draws the projectile.
    * @param {*} ctx Rendering context.
    */
    draw(ctx) {
        ctx.save();
        if (this.state !== "explode" && !this.direction) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, -this.x - this.width, this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}