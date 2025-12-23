/**
 * Represents a complex movable object with gravity, animation, and state handling.
 * Handles movement, jumping, falling, and transitions between animation states.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    isGameCharacter = true;

    /**
     * Creates a new instance with default position, speed, and animation settings.
     * @param {Object} entityImages - Image data containing animation frames.
     */
    constructor(entityImages, allAudios, world) {
        super();
        this.world = world;
        this.allAudios = allAudios;
        this.isGamecharacter = true;
        this.entityImages = entityImages;
        this.speedX = 8;
        this.speedY = 0;
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
        this.gravityInterval = 1000 / 60;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.movementSpeed = 5;
        this.init();

        this.ENDBOSS_PHASE = {
            INTRO: 0,
            AIR_EGGS: 1,
            STORM: 2,
            GROUND: 3,
            ENRAGE: 4,
            DEAD: 99
        };

        this.phase = this.ENDBOSS_PHASE.INTRO;
        this.phaseStartTime = performance.now();
        this.isVulnerable = false;

        this.AIR_STATE = {
            MOVE: 0,
            DROP: 1,
            WAIT: 2,
            DESCEND: 3
        };

        this.airState = this.AIR_STATE.MOVE;
        this.airTargetX = null;
        this.airDropIndex = 0;
        this.airLastActionTime = 0;

        this.airPoints = [
            23000,
            23400,
            23800,
            24200
        ];
        this.airPointIndex = 0;

        this.airDropSequence = [
            { type: 'small', delay: 0 },
            { type: 'small', delay: 2000 },
            { type: 'big', delay: 4000 },
        ];


    }

    /**
     * Initializes object size, offsets, images, and states.
     */
    init() {
        this.setSizeAndPosition();
        this.setOffset();
        this.initBaseImages();
        this.initStates();
    }

    /**
     * Sets the initial size and position.
     */
    setSizeAndPosition() {
        this.x = 23000;
        this.y = 205;
        this.width = 350;
        this.height = 500;
    }

    /**
     * Sets collision or interaction offset values.
     */
    setOffset() {
        this.offset.top = 98;
        this.offset.left = 75;
        this.offset.right = 80;
        this.offset.bottom = 35;
    }

    /**
     * Initializes base image sets.
     */
    initBaseImages() {
        this.idleImages = this.entityImages.endboss.idle || [];
        this.walkImages = this.entityImages.endboss.walk || [];
        this.deadImages = this.entityImages.endboss.dead || [];
        this.hurtImages = this.entityImages.endboss.hurt || [];
        this.flyImages = this.entityImages.endboss.fly || [];
        this.findsPeaceImages = this.entityImages.endboss.findsPeace || [];
        this.fireballAttackImages = this.entityImages.endboss.fireballAttack || [];
    }

    /**
     * Initializes state flags.
     */
    initStates() {
        this.isHurt = false;
        this.isDead = false;
        this.isDeadAnimationReady = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isJumping = false;
        this.isUnderTheGround = false;
        this.isFindsPeace = false;
        this.isFly = false;
        this.isFireballAttack = false;

        this.airMinX = 22650;      // links
        this.airMaxX = 23350;      // rechts
        this.airY = -100;           // feste Flughöhe
        this.airSpeed = 220;       // px pro Sekunde
        this.airDir = 1;           // 1 = rechts, -1 = links

        // optional: kleines "schweben"
        this.airBobAmp = 8;        // px
        this.airBobSpeed = 0.006;  // rad/ms (klein halten)

        // Zeitbasis
        this.lastAirTime = null;

        this.attackOnCooldown = false;
        this.hasFiredThisAttack = false;
        this.fireballCooldown = 2000; // ms
        this.lastFireballAttackTime = 0;

    }

    /**
     * Applies gravity by updating the vertical position over time.
     * @param {number} timestamp - Current time in milliseconds.
     */
    applyGravityBoss(timestamp) {
        if (!this.lastGravityUpdate) this.lastGravityUpdate = timestamp;
        const deltaTime = timestamp - this.lastGravityUpdate;
        if (deltaTime <= this.gravityInterval) return;
        this.updateVerticalPosition();
        this.lastGravityUpdate = timestamp;
    }

    /**
     * Updates the vertical position based on gravity and collisions.
     */
    updateVerticalPosition() {
        if (this.shouldApplyGravity()) {
            this.applyJumpPhysics();
            this.checkGroundCollision();
        } else {
            this.resetVerticalMovement();
        }
    }

    /**
     * Determines whether gravity should currently be applied.
     * @returns {boolean} True if gravity should be applied.
     */
    shouldApplyGravity() {
        if (this.isFly) return false;
        return this.isJumping || this.y < -35 || this.speedY > 0;
    }


    /**
     * Applies basic jump physics.
     */
    applyJumpPhysics() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Checks for ground collision and resets vertical movement if necessary.
     */
    checkGroundCollision() {
        if (this.y >= -35) {
            this.y = -35;
            this.speedY = 0;
            this.isJumping = false;
        }
    }

    /**
     * Resets vertical movement and jump state.
     */
    resetVerticalMovement() {
        this.speedY = 0;
        this.isJumping = false;
    }

    /**
     * Moves the object downward after death until it goes below the ground level.
     * @param {number} timestamp - Current time in milliseconds.
     */
    moveDownAfterDead(timestamp) {
        if (!this.lastMoveDownTime) this.lastMoveDownTime = timestamp;
        const deltaTime = timestamp - this.lastMoveDownTime;
        if (deltaTime <= 1000 / 60) return;
        if (this.isDead && !this.isUnderTheGround) {
            this.y += this.fallSpeed || 5;
            if (this.y > 600) {
                this.isUnderTheGround = true;
            }
        }
        this.lastMoveDownTime = timestamp;
    }

    /**
     * Updates movement and animation state each frame.
     */
    updateState(timestamp, setup) {
        this.updateDeltaTime(timestamp);
        switch (this.phase) {
            case this.ENDBOSS_PHASE.AIR_EGGS:
                this.updateAirEggPhase(timestamp, setup);
                break;

            case this.ENDBOSS_PHASE.STORM:
                this.updateStormPhase(timestamp, setup);
                break;

            case this.ENDBOSS_PHASE.GROUND:
                this.updateGroundPhase(timestamp, setup);
                break;

            case this.ENDBOSS_PHASE.ENRAGE:
                this.updateEnragePhase(timestamp, setup);
                break;
        }

        if (this.phase === this.ENDBOSS_PHASE.GROUND ||
            this.phase === this.ENDBOSS_PHASE.ENRAGE) {
            this.handleMovement();
        }

        this.handleStateAnimations();
    }

    /**
     * Updates delta time and calculates movement speed.
     * @param {number} timestamp - Current time in milliseconds.
     */
    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) {
            this.lastUpdateTime = timestamp;
            this.deltaSeconds = 0;
            return;
        }

        this.deltaSeconds = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;

        // optional für Ground-Movement
        this.movementSpeed = this.speedX * this.deltaSeconds * 60;
    }


    /**
     * Handles horizontal movement based on direction flags.
     */
    handleMovement() {
        if (this.isMovingLeft) return this.moveLeft();
        if (this.isMovingRight) return this.moveRight();
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.isFlipped = false;
        if (this.x > 0) {
            this.x -= this.movementSpeed;
        }
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.isFlipped = true;
        this.x += this.movementSpeed;
    }

    /**
     * Handles and updates the animation state based on current conditions.
     */
    handleStateAnimations() {
        if (this.isFindsPeace) return this.playFindsPeace();
        if (this.isDead) return this.playDeathAnimation();
        if (this.isHurt) return this.playHurtAnimation();
        if (this.isFly) return this.playFlyAnimation();
        if (this.isFireballAttack) return this.playFireballAttackAnimation()
        if (this.isJumping) return this.setAnimation('jump', 10);
        if (this.isMovingLeft || this.isMovingRight)
            return this.setAnimation('walk', 8);
        this.setAnimation('idle', 8);
    }

    /**
     * Plays the "finds peace" animation and resets the state when finished.
     */
    playFindsPeace() {
        this.setAnimation('findsPeace', 6);
        if (this.frameIndex >= this.findsPeaceImages.length) {
            this.isFindsPeace = false;
            this.frameIndex = 0;
        }
    }

    /**
     * Plays the death animation and stops it when finished.
     */
    playDeathAnimation() {
        if (!this.isDeadAnimationReady) {
            this.setAnimation('dead', 4);
        } else {
            this.currentAnimation = null;
        }
    }

    /**
     * Plays the hurt animation and resets the state when finished.
     */
    playHurtAnimation() {
        this.setAnimation('hurt', 4);
        if (this.frameIndex >= this.hurtImages.length) {
            this.isHurt = false;
            this.frameIndex = 0;
        }
    }

    /**
     * Plays the fly animation and resets the state when finished.
     */
    playFlyAnimation() {
        this.setAnimation('fly', 6);
        // if (this.frameIndex >= this.flyImages.length) {
        //     this.isFly = false;
        //     this.frameIndex = 0;
        // }
    }

    playFireballAttackAnimation() {
        this.setAnimation('fireballAttack', 5);
        if (this.frameIndex >= this.fireballAttackImages.length) {
            this.isFireballAttack = false;
            this.hasFiredThisAttack = false;
            this.frameIndex = 0;
        }
    }

    /**
     * Sets the current animation and adjusts its frame rate.
     * @param {string} name - Animation name.
     * @param {number} fps - Frames per second.
     */
    setAnimation(name, fps) {
        this.currentAnimation = name;
        this.frameInterval = 1000 / fps;
    }

    /**
     * Returns the image set for a given animation state.
     * @param {string} state - Animation state name.
     * @returns {Array<string>|undefined} The corresponding image set.
     */
    getAnimationImages(state) {
        switch (state) {
            case 'dead': return this.deadImages;
            case 'hurt': return this.hurtImages;
            case 'fly': return this.flyImages;
            case 'jump': return this.jumpImages;
            case 'walk': return this.walkImages;
            case 'findsPeace': return this.findsPeaceImages;
            case 'fireballAttack': return this.fireballAttackImages;
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
        if (deltaTime <= this.frameInterval) return;
        this.updateFrameImage();

        if (this.isFireballAttack) {
            const shootFrame = 13; // anpassen! (0..len-1)
            if (this.frameIndex === shootFrame && !this.hasFiredThisAttack) {
                const audio = this.allAudios.fireballShotSound.cloneNode();
                audio.play();

                this.shootProjectile("fireball", this.world.character);
                this.hasFiredThisAttack = true;
            }
        }

        this.handleDeathAnimation();
        this.lastFrameTime = timestamp;
    }

    /**
     * Updates the currently displayed animation frame.
     */
    updateFrameImage() {
        const images = this.getAnimationImages(this.currentAnimation);
        if (!images || images.length === 0) return;
        this.img = images[this.frameIndex % images.length];
        this.frameIndex++;
    }

    /**
     * Handles logic for death animation progression and final frame handling.
     */
    handleDeathAnimation() {
        if (this.currentAnimation !== 'dead') return;
        if (this.frameIndex < this.deadImages.length) return;
        this.isDeadAnimationReady = true;
        this.frameIndex = 0;
        this.img = this.deadImages[7];
    }

    setPhase(newPhase) {
        this.phase = newPhase;
        this.phaseStartTime = performance.now();

        switch (newPhase) {
            case this.ENDBOSS_PHASE.AIR_EGGS:
                this.isFly = true;
                this.isVulnerable = false;
                this.airMinX = 22000;
                this.airMaxX = 23600;
                this.airY = -100;
                this.airDir = 1;
                this.lastAirTime = null;
                this.y = this.airY;
                this.speedY = 0;
                this.isJumping = false;
                break;

            case this.ENDBOSS_PHASE.STORM:
                this.isFly = true;
                this.isVulnerable = false;
                break;

            case this.ENDBOSS_PHASE.GROUND:
                this.isFly = false;
                // this.land();
                this.isVulnerable = true;
                break;

            case this.ENDBOSS_PHASE.ENRAGE:
                this.isVulnerable = true;
                this.speedX *= 1.3;
                break;
        }
    }

    updateAirEggPhase(timestamp, setup) {
        const attack = setup.endbossAttack;

        if (this.airState !== this.AIR_STATE.DESCEND) {
            this.y = this.airY;
        }

        // if (this.airState === this.AIR_STATE.DESCEND) {
        //     this.isFly = false;
        // } else {
        //     this.isFly = true;
        // }

        this.isVulnerable = false;

        switch (this.airState) {

            // 1️⃣ Fliegen zur nächsten Position
            case this.AIR_STATE.MOVE: {
                const targetX = this.airPoints[this.airPointIndex];

                if (this.x < targetX) this.airDir = 1;
                else if (this.x > targetX) this.airDir = -1;

                this.x += this.airDir * this.airSpeed * this.deltaSeconds;
                this.isFlipped = this.airDir === 1;

                if (
                    (this.airDir === 1 && this.x >= targetX) ||
                    (this.airDir === -1 && this.x <= targetX)
                ) {
                    this.x = targetX;
                    this.airState = this.AIR_STATE.DROP;
                    this.airDropIndex = 0;
                    this.airLastActionTime = timestamp;
                    this.airDropStartTime = timestamp;
                }
                break;
            }

            // 2️⃣ Eier droppen
            case this.AIR_STATE.DROP: {
                const seq = this.airDropSequence;
                const step = seq[this.airDropIndex];
                if (!step) {
                    this.airState = this.AIR_STATE.WAIT;
                    this.airLastActionTime = timestamp;
                    return;
                }

                const elapsed = timestamp - this.airDropStartTime;

                if (elapsed >= step.delay) {
                    attack.spawnEgg(this, setup, step.type, 0);
                    this.airDropIndex++;
                }
                break;
            }


            case this.AIR_STATE.WAIT: {
                if (timestamp - this.airLastActionTime > 800) {

                    // 🔚 letzter Air-Point erreicht?
                    if (this.airPointIndex >= this.airPoints.length - 1) {
                        this.airState = this.AIR_STATE.DESCEND;
                    } else {
                        this.airPointIndex++;
                        this.airState = this.AIR_STATE.MOVE;
                    }
                }
                break;
            }

            case this.AIR_STATE.DESCEND: {
                const groundY = 205;
                const descendSpeed = 300; // px pro Sekunde

                const dy = groundY - this.y;                 // Ziel-Differenz
                const step = descendSpeed * this.deltaSeconds;

                // Richtung: +1 wenn groundY > y, sonst -1
                const dir = Math.sign(dy);

                // Wenn wir schon da sind (oder extrem nah)
                if (dir === 0) {
                    this.y = groundY;
                } else {
                    // Move towards ohne zu überschießen
                    const move = Math.min(Math.abs(dy), step);
                    this.y += dir * move;
                }

                // Flip behalten wie zuletzt
                this.isFlipped = this.airDir === -1;

                // Landen (mit Toleranz gegen Floating-Point)
                if (Math.abs(groundY - this.y) <= 0.0001) {
                    this.y = groundY;
                    this.isFly = false;
                    this.speedY = 0;
                    this.isJumping = false;
                    this.setPhase(this.ENDBOSS_PHASE.GROUND);
                }

                break;
            }




        }

        // Phase endet nach z.B. 4 Stops
        // if (this.airPointIndex >= 4) {
        //     this.setPhase(this.ENDBOSS_PHASE.STORM);
        // }
    }



    updateGroundPhase(timestamp, setup) {
        const hero = setup.world.character;
        const dist = Math.abs(hero.x - this.x);

        if (
            dist > 400 &&
            !this.isFireballAttack &&
            (timestamp - this.lastFireballAttackTime) > this.fireballCooldown
        ) {
            this.isFireballAttack = true;
            this.hasFiredThisAttack = false;
            this.frameIndex = 0;
            this.lastFireballAttackTime = timestamp;

            const audio = this.allAudios.fireballChargeSound.cloneNode();
            audio.play();
        }
    }


    flyPatrol(timestamp) {
        if (!this.lastAirTime) this.lastAirTime = timestamp;
        const dt = (timestamp - this.lastAirTime) / 1000;
        this.lastAirTime = timestamp;

        const bob = this.airBobAmp
            ? Math.sin(timestamp * this.airBobSpeed) * this.airBobAmp
            : 0;

        this.y = this.airY + bob;

        this.x += this.airDir * this.airSpeed * dt;

        if (this.x >= this.airMaxX) {
            this.x = this.airMaxX;
            this.airDir = -1;
        } else if (this.x <= this.airMinX) {
            this.x = this.airMinX;
            this.airDir = 1;
        }

        this.isFlipped = this.airDir === 1;
    }

    shootProjectile(type, character) {
        // Ziel beim Abschuss einfrieren (Mitte des Chars)
        const targetX = character.x + character.width * 0.5;
        const targetY = character.y + character.height * 0.35;

        // Mundposition (abhängig von Blickrichtung / Flip)
        const mouthX = this.isFlipped
            ? this.x + this.width * 0.82   // nach rechts
            : this.x + this.width * 0.18;  // nach links

        const mouthY = this.y + this.height * 0.20; // höher = mehr “Mund”

        const projectile = new EndbossFireball(type, mouthX, mouthY, targetX, targetY);

        if (!this.world.projectiles) this.world.projectiles = [];
        this.world.projectiles.push(projectile);
    }







}