/**
 * Represents a movable non-player character with simple movement and animation behavior.
 * Handles walking, idle, and death states.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    isGamecharacter = true;

    /**
     * Creates a new instance with randomized speed and default animation settings.
     * @param {Object} entityImages - Image data containing animation frames.
     */
    constructor(currentEnemy, entityImages, width = 120, height = 120, y = 545, x = null, allAudios, world) {
        super();
        this.world = world;
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
        this.speedX = 0;
        this.knockbackActive = false;
        this.acceleration = 1.5;

        this.y = y;
        this.x = x;
        this.spawnY = y
        this.height = height;
        this.width = width;
        this.attackOnCooldown = false;
        this.init(this.currentEnemy);

        this.speedX = 1.0;
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;

        this.attackCooldownMs = 900;
        this.lastAttackTime = 0;

        this.meleeRange = 65;      // small
        this.rangedRange = 320;    // big

        this.hurtUntil = 0;
        this.removeAt = 0;
        this.isRemoved = false;

        this.knockFriction = 0.85;     // pro "60fps frame"
        this.knockStopThreshold = 0.5; // wann Knockback endet

        this.attackHitbox = {
            top: 45,
            left: 20,
            right: 120,
            bottom: 45,
            active: false
        };

        this.hasHitPlayerThisAttack = false;




    }

    /**
     * Initializes image sets, size, and offset configuration.
     */
    init(currentEnemy) {
        this.walkImages = this.entityImages[currentEnemy]?.walk || [];
        this.hurtImages = this.entityImages[currentEnemy]?.hurt || [];
        this.deadImages = this.entityImages[currentEnemy]?.dead || [];
        this.attackImages = this.entityImages[currentEnemy]?.attack || []
        if (this.x == null) this.setSizeAndPosition();
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
        if (this.currentEnemy === 'chickenMutatesSmall') {
            this.offset.top = 25;
            this.offset.left = 25;
            this.offset.right = 35;
            this.offset.bottom = 10;
        } else {
            this.offset.top = 35;
            this.offset.left = 20;
            this.offset.right = 60;
            this.offset.bottom = 10;
        }
    }

    /**
     * Updates movement and animation each frame.
     */
    updateState(timestamp) {

        this.updateDeltaTime(timestamp);
        // Hurt automatisch beenden (ohne setTimeout)
        if (this.isHurt && timestamp >= this.hurtUntil) {
            this.isHurt = false;
        }

        this.applyGravity3(timestamp);

        if (!this.knockbackActive && !this.isDead && !this.isHurt) {
            if (this.inAttackRange()) {
                if (timestamp - this.lastAttackTime > this.attackCooldownMs) {
                    this.isMovingLeft = false;
                    this.isMovingRight = false;
                    this.tryStartAttack(timestamp);
                } else {
                    // Nicht angreifen → trotzdem leicht zurückgehen
                    this.keepDistanceToTarget(this.world.character, {
                        desiredDist: this.meleeRange,
                        speed: 1.5,
                        faceTarget: true
                    });
                }
            } else {
                this.moveToTargetX(this.world.character, {
                    desiredDist: this.meleeRange,
                    tolerance: 10,
                    speed: 2
                });
            }
        }

        // Knockback
        if (this.knockbackActive) {
            const dt60 = (this.deltaTime ?? 1 / 60) * 60;

            this.x += (this.speedXKnock || 0) * dt60;

            // Friction pro 60fps Frame
            this.speedXKnock *= Math.pow(this.knockFriction, dt60);

            if (Math.abs(this.speedXKnock) < this.knockStopThreshold) {
                this.speedXKnock = 0;
                this.knockbackActive = false;
            }
        } else {
            this.handleMovement();
        }



        this.handleAnimation();

        if (!this.isDead && !this.isGravity && !this.knockbackActive) {
            const diff = this.y - this.spawnY;
            if (Math.abs(diff) > 0.5) this.y = this.spawnY;
        }

        if (this.isDead && this.removeAt && timestamp >= this.removeAt) {
            this.isRemoved = true;  // World removed dann per filter/splice
        }

    }


    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        this.deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        this.movementSpeed = this.speedX * this.deltaTime * 60; // ✅
    }





    moveLeft() {
        this.isFlipped = false;
        this.x -= this.movementSpeed;
    }

    moveRight() {
        this.isFlipped = true;
        this.x += this.movementSpeed;
    }


    /**
     * Handles movement logic based on direction flags.
     */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
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

                if (this.isAttack && this.currentEnemy === "chickenMutatesSmall") {
                    if (this.isHurt || this.isDead) return;

                    const hitFrame = 6; // z. B. Frame 3 (Index 2) trifft
                    this.attackHitbox.active = (this.frameIndex === hitFrame);

                    if (this.frameIndex >= images.length - 1) {
                        this.attackHitbox.active = false;
                        this.isAttack = false;
                        this.frameIndex = 0;
                        this.hasHitPlayerThisAttack = false;
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

    moveToTargetX(target = null, {
    desiredDist = 0,
    tolerance = 10,
    speed = 60,             // px pro Sekunde
    faceTarget = true
} = {}) {
    const t = target ?? this.world?.character;
    if (!t) return false;

    // Zielpunkt: gewünschte Distanz links/rechts vom Target
    const tCenter = t.x + t.width * 0.5;
    const eCenter = this.x + this.width * 0.5;
    const dx = tCenter - eCenter;

    const targetX = this.x + Math.sign(dx) * Math.max(0, Math.abs(dx) - desiredDist);
    return this.moveToX(targetX, { tolerance, speed, faceTarget, target: t });
}



   moveToX(targetX, {
    tolerance = 3,
    snap = true,
    speed = 60,            // px pro Sekunde (nicht Frame!)
    faceTarget = true,
    onArrive = null,
    target = null
} = {}) {
    const d = targetX - this.x;

    // Blickrichtung setzen, wenn gewünscht
    if (faceTarget && target) {
        this.isFlipped = target.x > this.x;
    }

    // Ziel erreicht?
    if (Math.abs(d) <= tolerance) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        if (snap) this.x = targetX;
        onArrive?.();
        return true;
    }

    // Schrittweite framerate-unabhängig berechnen
    const dt = this.deltaTime ?? 1 / 60;
    const maxStep = speed * dt;
    const step = Math.sign(d) * Math.min(Math.abs(d), maxStep);
    this.x += step;

    this.isMovingRight = d > 0;
    this.isMovingLeft = d < 0;
    return false;
}


    keepDistanceToTarget(target = null, {
        desiredDist = 120,
        tolerance = 12,
        speed = 1,            // px pro Frame @60fps
        faceTarget = true
    } = {}) {
        const t = target ?? this.world?.character;
        if (!t) return false;

        const ex = this.x + this.width * 0.5;
        const tx = t.x + t.width * 0.5;

        const dx = tx - ex;           // + => target rechts
        const dist = Math.abs(dx);

        if (faceTarget) this.isFlipped = dx > 0;

        // im Band -> stehen
        if (dist >= desiredDist - tolerance && dist <= desiredDist + tolerance) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
            return true;
        }

        // Richtung: zu weit -> hin, zu nah -> weg
        const wantGoToTarget = dist > desiredDist + tolerance;
        const dir = wantGoToTarget ? Math.sign(dx) : -Math.sign(dx); // - => weg

        const step = speed * (this.deltaTime ?? 1 / 60) * 60;
        this.x += dir * step;

        this.isMovingRight = dir > 0;
        this.isMovingLeft = dir < 0;

        return false;
    }

    inAttackRange() {
        const t = this.world?.character;
        if (!t) return false;

        const ex = this.x + this.width * 0.5;
        const tx = t.x + t.width * 0.5;
        const dist = Math.abs(tx - ex);

        const range = (this.currentEnemy === "chickenMutatesBig") ? this.rangedRange : this.meleeRange;
        return dist <= range;
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
        hurtMs = 350,
        deathRemoveMs = 2000,
        onHurtSound = null,
        onDeathSound = null
    } = {}) {
        if (this.isDead || this.isHurt) return false;
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
        } else {
            this.isHurt = true;
            this.hurtUntil = timestamp + hurtMs;
            onHurtSound?.();
        }

        return true;
    }

}
