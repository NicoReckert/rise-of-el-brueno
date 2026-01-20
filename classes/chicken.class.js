/**
 * Represents a movable non-player character with simple movement and animation behavior.
 * Handles walking, idle, and death states.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    isGamecharacter = false;

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
        this.lastFrameTime = 0;
        this.currentAnimation = 'walk';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
        this.isMovingLeft = true;
        this.isDead = false;
        this.isHurt = false;
        this.isAttack = false;
        this.health = 3;
        this.speedX = 0.6;
        this.knockbackActive = false;
        this.acceleration = 1.5;

        this.y = y;
        this.x = x;
        this.spawnY = y
        this.height = height;
        this.width = width;
        this.attackOnCooldown = false;
        this.init(this.currentEnemy);
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;

        this.attackCooldownMs = 900;
        this.lastAttackTime = 0;

        this.meleeRange = 64   // small
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
        // 🔹 DeltaTime aktualisieren
        this.updateDeltaTime(timestamp);

        // 🔹 Tod: nur Death-Animation + Remove-Timer
        if (this.isDead) {
            this.handleAnimation();
            if (this.removeAt && timestamp >= this.removeAt) {
                this.isRemoved = true;
            }
            return;
        }

        // 🔹 Gravity / Knockback-Y
        this.applyGravity3(timestamp);

        const char = this.world.character;

        // 🔹 AI-Logik (laufen, Abstand, angreifen) in eigener Funktion
        this.updateAI(timestamp, char);

        // 🔹 Knockback-Bewegung in X
        if (this.knockbackActive) {
            const dt60 = (this.deltaTime ?? 1 / 60) * 60;
            this.x += (this.speedXKnock || 0) * dt60;
            this.speedXKnock *= Math.pow(this.knockFriction, dt60);

            if (Math.abs(this.speedXKnock) < this.knockStopThreshold) {
                this.speedXKnock = 0;
                this.knockbackActive = false;
            }
        } else {
            // 🔹 Normale Bewegung durch isMovingLeft / isMovingRight
            this.handleMovement();
        }

        // 🔹 Nach Knockback/Gravity sauber auf Spawn-Y zurückschnappen
        if (!this.isGravity && !this.knockbackActive) {
            const diff = this.y - this.spawnY;
            if (Math.abs(diff) > 0.5) this.y = this.spawnY;
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
            this.frameInterval = 1000 / 6;
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
        this.handleAnimation()
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime > this.frameInterval) {
            let images = this.getAnimationImages(this.currentAnimation);
            if (images && images.length > 0) {
                this.img = images[this.frameIndex % images.length];

                if (this.currentAnimation === 'hurt') {
                    if (this.frameIndex >= images.length - 1) {
                        this.isHurt = false;
                        this.currentAnimation = 'walk';  // oder null
                        this.frameIndex = 0;
                    }
                }


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
    // 👉 NICHT mehr character.x > this.x,
    // sondern immer in Blickrichtung des Huhns
    const direction = this.isFlipped; // true = nach rechts, false = nach links

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
    desiredDist = this.meleeRange,
    tolerance = 6,
    speed = 1.0,        // ruhig etwas langsamer
    faceTarget = true
} = {}) {
    const t = target ?? this.world?.character;
    if (!t) return false;

    const isAboveGround = typeof t.isAboveGround === 'function' && t.isAboveGround();

    // 🛑 Wenn der Character springt → Chicken bleibt stehen
    if (isAboveGround && t.isJumping) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        return true;
    }

    const ex = this.x + this.width * 0.5;
    const tx = t.x + t.width * 0.5;
    const dx = tx - ex;
    const dist = Math.abs(dx);

    if (faceTarget) this.isFlipped = dx > 0;

    // ✅ Abstand ist ok → keine Bewegung
    if (dist >= desiredDist - tolerance && dist <= desiredDist + tolerance) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        return true;
    }

    const wantGoToTarget = dist > desiredDist + tolerance;
    let dir = wantGoToTarget ? Math.sign(dx) : -Math.sign(dx);

    if (dir === 0) {
        dir = this.isFlipped ? 1 : -1;
    }

    // Wenn Charakter springt → kein Rückzug
    if (!wantGoToTarget && t.isJumping) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        return true;
    }

    let finalSpeed = speed;
    if (!wantGoToTarget && dist < 20) {
        finalSpeed *= 1.3;
        finalSpeed = Math.min(finalSpeed, 1.8);
    }

    const step = finalSpeed * (this.deltaTime ?? 1 / 60) * 60;
    this.x += dir * step;

    this.isMovingRight = false;
    this.isMovingLeft = false;

    return false;
}




    inAttackRange(char = this.world?.character) {
    const t = char;
    if (!t) return false;

    // Wenn der Character springt → nicht angreifen
    if (t.isAboveGround && typeof t.isAboveGround === 'function' && t.isAboveGround()) {
        return false;
    }

    const ex = this.x + this.width * 0.5;
    const tx = t.x + t.width * 0.5;
    const dist = Math.abs(tx - ex);

    let range;
    if (this.currentEnemy === "chickenMutatesBig") {
        range = this.rangedRange;
    } else {
        // 🔴 HIER: dynamische Nahkampfreichweite inkl. Rücken-Bonus
        range = this.getDesiredMeleeDistance(t);
    }

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
            this.currentAnimation = 'hurt';
            this.frameIndex = 0;
            this.lastFrameTime = 0;
            onHurtSound?.();
        }

        return true;
    }

    /**
 * Entscheidet, ob und wie das Huhn auf den Charakter reagiert
 * (laufen, Abstand halten, angreifen).
 */
  updateAI(timestamp, char) {
    if (!char) return;

    // während Knockback / Hurt / Tot / Attack keine AI-Steuerung
    if (this.knockbackActive || this.isHurt || this.isDead || this.isAttack) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        return;
    }

    const charIsHigh = this.isCharacterFarAbove(char);
    if (charIsHigh) {
        // Charakter deutlich über mir → nicht nachziehen
        this.isMovingLeft = false;
        this.isMovingRight = false;
        return;
    }

    // 🔹 SPEZIAL-LOGIK FÜR BIG-CHICKEN (RANGED)
    if (this.currentEnemy === 'chickenMutatesBig') {
        // Immer zum Charakter schauen
        this.isFlipped = char.x > this.x;

        // Abstand in X
        const ex = this.x + this.width * 0.5;
        const tx = char.x + char.width * 0.5;
        const dist = Math.abs(tx - ex);

        // In Schuss-Reichweite?
        if (dist <= this.rangedRange) {
            if (timestamp - this.lastAttackTime > this.attackCooldownMs) {
                // Angriff möglich → stehen + schießen
                this.isMovingLeft = false;
                this.isMovingRight = false;
                this.tryStartAttack(timestamp);
            } else {
                // Cooldown → ggf. etwas zurückgehen, wenn der Spieler VIEL zu nah ist
                if (dist < this.meleeRange * 0.7) {
                    this.keepDistanceToTarget(char, {
                        desiredDist: this.meleeRange,
                        faceTarget: true,
                        speed: 1.0
                    });
                } else {
                    this.isMovingLeft = false;
                    this.isMovingRight = false;
                }
            }
        } else {
            // Noch ausserhalb der Range → hinlaufen, bis ein guter Distanzbereich erreicht ist
            this.moveToTargetX(char, {
                desiredDist: this.rangedRange * 0.7,
                tolerance: 10,
                snap: false,
                faceTarget: true,
                speed: 40
            });
        }

        // WICHTIG: Big-Chicken fertig, kleine Hühner unten
        return;
    }

    // 🔹 AB HIER: LOGIK FÜR KLEINE HÜHNER (dein bisheriger Code)
    const desiredDistNear = this.getDesiredMeleeDistance(char); // mit Rücken-Bonus
    const desiredDistApproach = this.meleeRange;                // Basis zum Hinlaufen
    const behind = this.isBehindCharacter(char);

    if (this.inAttackRange(char)) {
        // im Nahkampfradius
        if (timestamp - this.lastAttackTime > this.attackCooldownMs) {
            // Angriff möglich
            this.isMovingLeft = false;
            this.isMovingRight = false;
            this.tryStartAttack(timestamp);
        } else {
            // Angriff im Cooldown
            if (!behind) {
                // VOR dem Charakter → leicht Abstand regeln
                this.keepDistanceToTarget(char, {
                    desiredDist: desiredDistNear,
                    faceTarget: true
                });
            } else {
                // HINTER dem Rücken → einfach stehen bleiben, kein Gezappel
                this.isMovingLeft = false;
                this.isMovingRight = false;
            }
        }
    } else {
        // Noch nicht in AttackRange → hinlaufen bis Basis-Melee erreicht ist
        this.moveToTargetX(char, {
            desiredDist: desiredDistApproach,
            tolerance: 10,
            snap: false,
            faceTarget: true,
            speed: 40
        });
    }
}




    /**
     * True, wenn der Character deutlich über den Füßen des Huhns ist.
     */
    isCharacterFarAbove(char, threshold = 40) {
        const myBottom = this.y + this.height;
        const charBottom = char.y + char.height;
        return (myBottom - charBottom) > threshold;
    }

    /**
     * Basis-Melee-Range + Rücken-Bonus bei kleinen Hühnern.
     */
   getDesiredMeleeDistance(char) {
    if (!char) return this.meleeRange;

    let desired = this.meleeRange;

    if (this.currentEnemy === 'chickenMutatesSmall' && this.isBehindCharacter(char)) {
        !char.isProtect? desired += 12 : desired += 22;   // kleiner Bonus, nicht zu groß (sonst zappelt er leichter)
    }

    return desired;
}


    isBehindCharacter(char) {
        const ex = this.x + this.width * 0.5;
        const tx = char.x + char.width * 0.5;

        const charFacingRight = !char.isFlipped;   // bei dir: isFlipped = nach links
        const chickenRightOfChar = ex > tx;

        // Char schaut rechts → Huhn links davon = hinten
        // Char schaut links  → Huhn rechts davon = hinten
        return (
            (charFacingRight && !chickenRightOfChar) ||
            (!charFacingRight && chickenRightOfChar)
        );
    }



}
