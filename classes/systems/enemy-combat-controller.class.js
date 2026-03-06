export class EnemyCombatController {
    constructor() {

    }

        shootProjectile(type, character) {
        // 👉 NICHT mehr character.x > this.x,
        // sondern immer in Blickrichtung des Huhns
        const direction = this.isFlipped; // true = nach rechts, false = nach links
        const setup = this.world.townLevelSetup;
        const offsetX = direction ? this.width - 25 : -45;
        const offsetY = this.y + this.height * 0.22; // aus dem Schnabel

        const projectile = new Projectile(this.entityImages, type, this.x + offsetX, offsetY, direction);
        if (!setup.townLevel.projectiles) setup.townLevel.projectiles = [];
        setup.townLevel.projectiles.push(projectile);
    }

        tryStartAttack(timestamp) {
        if (this.isDead || this.isHurt) return false;
        if (this.isAttack) return false;

        if (timestamp - this.lastAttackTime < this.attackCooldownMs) return false;

        this.isAttack = true;
        this.lastAttackTime = timestamp;

        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.hasFiredThisAttack = false;
        return true;
    }

        receiveHit(timestamp, {
        dmg = 1,
        attackerFlipped = false,     // kommt vom Character.isFlipped
        knockX = 12,                 // "px per frame @60fps"
        knockY = 12,
        deathRemoveMs = 2000,
        onHurtSound = null,
        onDeathSound = null
    } = {}) {
        if (this.isDead || this.isHurt) return false;
        if (this.currentEnemy === 'dragonSmall') {
            const vulnerableStates = ['dive_fast', 'attack', 'approach_low'];

            // nur in diesen States darfst du ihn treffen
            if (!vulnerableStates.includes(this.airState)) {
                return false;
            }

            // wenn er in diesem Dive schon getroffen wurde → kein weiterer Treffer
            if (this.hasBeenHitThisDive) {
                return false;
            }

            this.hasBeenHitThisDive = true;
        }
        this.attackHitbox.active = false;
        this.hasHitPlayerThisAttack = false;

        // Schaden
        this.health -= dmg;

        // Attack abbrechen
        if (this.isAttack) {
            this.isAttack = false;
            this.hasFiredThisAttack = false;
        }

        // Knockback Start
        const dir = attackerFlipped ? -1 : 1;
        this.speedXKnock = dir * knockX;
        this.speedY = knockY;
        this.isGravity = true;
        this.knockbackActive = true;

        // Movement stoppen
        this.isMovingLeft = false;
        this.isMovingRight = false;

        if (this.health <= 0) {
            this.isDead = true;
            this.isHurt = false;
            this.removeAt = timestamp + deathRemoveMs;
            onDeathSound?.();
            if (this.currentEnemy === 'dragonSmall') {
                this.deathPhase = 'fall';
                this.isGravity = false;
                this.knockbackActive = false;
            }
        } else {
            this.isHurt = true;
            this.setAnimation('hurt');
            this.frameIndex = 0;
            this.lastFrameTime = 0;
            onHurtSound?.();
        }

        return true;
    }
}