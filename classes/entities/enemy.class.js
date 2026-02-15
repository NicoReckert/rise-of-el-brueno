import { MovableObject } from '../systems/movable-object.class.js'
import { Projectile } from './projectile.class.js';

/**
 * Represents a movable non-player character with simple movement and animation behavior.
 * Handles walking, idle, and death states.
 * @extends MovableObject
 */
export class Enemy extends MovableObject {
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
        this.sheetIndex = 0;
        this.animationFinished = false;
        this.setAnimation('walk')
        // this.currentAnimation = 'walk';
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
        this.spawnY = (this.currentEnemy === 'dragonSmall') ? 200 : y;
        this.y = this.spawnY;
        this.x = x;
        this.height = height;
        this.width = width;
        this.attackOnCooldown = false;
        this.init(this.currentEnemy);
        this.movementSpeed = 0;
        this.lastUpdateTime = 0;

        this.attackCooldownMs = 3000; //900
        this.lastAttackTime = 0;

        this.meleeRange = 64   // small
        this.rangedRange = 320;    // big

        this.hurtUntil = 0;
        this.removeAt = 0;
        this.isRemoved = false;

        this.knockFriction = 0.85;     // pro "60fps frame"
        this.knockStopThreshold = 0.5; // wann Knockback endet

        this.attackHitbox = currentEnemy !== 'dragonSmall'
            ? {
                top: 45,
                left: 20,
                right: 120,
                bottom: 45,
                active: false
            }
            :
            this.attackHitbox = {
                top: 68,     // etwas unterhalb Kopf
                left: 5,    // Schnabel-Vorstoß
                right: 135,   // kaum nach hinten
                bottom: 52,  // Brust/Kopf-Höhe
                active: false
            };


        this.hasHitPlayerThisAttack = false;

        //dragonSmall
        // Dragon only
        this.airState = 'idle'; // approach | dive | retreat
        this.attackDistance = 220;
        this.approachDistance = 500;
        this.retreatHeight = 140;
        this.flySpeed = 60;
        this.diveSpeed = 180;
        this.diveStartTime = 0;
        this.diveStartDuration = 250; // ms (perfekt für 35°)
        this.diveUpAngle = null;
        this.exitDir = 1;
        this.lockDirection = false;
        this.approachBaseY = null;
        this.planeY = null;    // Höhe für den geraden Tiefflug
        this.preDiveX = null;  // Punkt vor dem Character
        this.postDiveX = null;
        this.hasAttackedThisDive = false;
        this.lowApproachSpeed = this.flySpeed * 2.5;
        this.deathPhase = null;        // 'fall' | 'impact' | 'done'
        this.deathFallSpeed = 350;     // px/s, kannst du tunen
        this.deathGroundY = 525;
        this.hasBeenHitThisDive = false;
    }

    /**
     * Initializes image sets, size, and offset configuration.
     */
    init(currentEnemy) {
        this.idle = this.entityImages[currentEnemy]?.idle ?? [];
        this.walk = this.entityImages[currentEnemy]?.walk ?? [];
        this.hurt = this.entityImages[currentEnemy]?.hurt ?? [];
        this.dead = this.entityImages[currentEnemy]?.dead ?? [];
        this.attack = this.entityImages[currentEnemy]?.attack ?? [];
        this.airApproach = this.entityImages[currentEnemy]?.airApproach ?? [];
        this.diveStart = this.entityImages[currentEnemy]?.diveStart ?? [];
        this.diveFast = this.entityImages[currentEnemy]?.diveFast ?? [];
        this.diveUpShallow = this.entityImages[currentEnemy]?.diveUpShallow ?? [];
        this.diveUpMedium = this.entityImages[currentEnemy]?.diveUpMedium ?? [];
        this.diveUpSteep = this.entityImages[currentEnemy]?.diveUpSteep ?? [];
        this.fallDown = this.entityImages[currentEnemy]?.fallDown ?? [];
        this.impact = this.entityImages[currentEnemy]?.impact ?? [];
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
        } else if (this.currentEnemy === 'chickenMutatesBig') {
            this.offset.top = 35;
            this.offset.left = 20;
            this.offset.right = 60;
            this.offset.bottom = 10;
        } else {
            this.offset.top = 60;
            this.offset.left = 10;
            this.offset.right = 10;
            this.offset.bottom = 45;
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
            const dt = this.deltaTime ?? 1 / 60;

            if (this.currentEnemy === 'dragonSmall') {
                if (this.deathPhase === 'fall') {
                    // runterfallen
                    this.y += this.deathFallSpeed * dt;

                    if (this.y >= this.deathGroundY) {
                        this.y = this.deathGroundY;
                        this.deathPhase = 'impact';
                        this.frameIndex = 0;
                        this.lastFrameTime = 0;
                    }
                }
            }

            this.handleAnimation();

            if (this.removeAt && timestamp >= this.removeAt) {
                this.isRemoved = true;
            }
            return;
        }



        const char = this.world.character;

        // 🐉 DRAGON AI
        if (this.currentEnemy === 'dragonSmall') {
            this.updateDragonAI(timestamp, char);
            this.handleAnimation();
            return;
        }

        // 🔹 Gravity / Knockback-Y
        this.applyGravity3(timestamp);

        // 🔹 Nach Knockback/Gravity sauber auf Spawn-Y zurückschnappen
        if (!this.isGravity && !this.knockbackActive) {
            const diff = this.y - this.spawnY;
            if (Math.abs(diff) > 0.5) this.y = this.spawnY;
        }

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
        if (this.currentEnemy === 'dragonSmall' && this.isDead) {
            if (this.deathPhase === 'fall') {
                this.setAnimation('fallDown');
                this.frameInterval = 1000 / 12;   // 12 fps, gern tunen
            } else if (this.deathPhase === 'impact') {
                this.setAnimation('impact');
                this.frameInterval = 1000 / 15;   // etwas schneller
            } else {
                // 'done' → benutze die dead-Animation (1 Frame)
                this.setAnimation('dead');
                this.frameInterval = 1000 / 4; // egal, nur Formalität
            }
            return;
        }

        if (this.isDead) {
            this.playDeathAnimation();
            return;
        }
        if (this.currentEnemy === 'dragonSmall') {
            if (this.isHurt) {
                this.setAnimation('hurt');
                this.frameInterval = 1000 / 10;
                return;
            }

            if (this.isAttack) {
                this.setAnimation('attack');
                this.frameInterval = 1000 / 6.5;
                return;
            }
            switch (this.airState) {
                case 'idle':
                    this.setAnimation('idle');
                    this.frameInterval = 1000 / 6;
                    break;

                case 'approach':
                case 'approach_low':
                    this.setAnimation('airApproach');
                    this.frameInterval = 1000 / 6;
                    break;

                case 'dive_start':
                    this.setAnimation('diveStart');
                    this.frameInterval = 1000 / 7;
                    break;

                case 'dive_fast':
                    this.setAnimation('diveFast');
                    this.frameInterval = 1000 / 9;
                    break;

                case 'attack':
                    this.setAnimation('attack');
                    this.frameInterval = 1000 / 6.5; // 3 Frames → ca. 250ms, schön snappy
                    break;

                case 'retreat':
                    this.setAnimation('idle');
                    this.frameInterval = 1000 / 6;
                    break;

                case 'dive_up_shallow':
                    this.setAnimation('diveUpShallow');
                    this.frameInterval = 1000 / 7;
                    break;

                case 'dive_up_medium':
                    this.setAnimation('diveUpMedium');
                    this.frameInterval = 1000 / 8;
                    break;

                case 'dive_up_steep':
                    this.setAnimation('diveUpSteep');
                    this.frameInterval = 1000 / 9;
                    break;

                case 'fall_down':
                    this.setAnimation('fallDown');
                    this.frameInterval = 1000 / 6.5;
                    break;

                case 'impact':
                    this.setAnimation('impact');
                    this.frameInterval = 1000 / 6.5;
                    break;
            }
            return;
        }

        if (this.isAttack) {
            this.setAnimation('attack');
            this.frameInterval = 1000 / 5;
        } else if (this.isHurt) {
            this.setAnimation('hurt');
            this.frameInterval = 1000 / 6;
        } else if (this.isMovingLeft || this.isMovingRight) {
            this.setAnimation('walk');
            this.frameInterval = 1000 / 5;
        } else {
            this.setAnimation('idle');
            this.frameInterval = 1000 / 5;
        }
    }

    /**
     * Plays the death animation and adjusts vertical position.
     */
    playDeathAnimation() {
        if (this.currentEnemy === 'dragonSmall') {
            // für den Drachen übernimmt die deathPhase-Logik alles
            return;
        }

        const anim = this.dead;
        if (!anim) return;

        this.currentAnimation = null;   // keine weitere Animation
        this.y = 565;

        // 🔹 Arrays
        if (Array.isArray(anim) && anim.length > 0) {
            this.img = anim[0];      // oder anim[anim.length - 1], wenn du das letzte Bild willst
            this.frameSource = null; // GANZ wichtig bei Wechsel von Sheets -> Array
            return;
        }

        // 🔹 Einzelnes Spritesheet
        if (anim.type === 'sheet') {
            const { image, meta, anim: overrideName } = anim;
            const animName = overrideName ?? 'dead';
            const def =
                meta.animations?.[animName] ??
                meta.animations?.default;

            const from = def?.from ?? 0;            // erster Frame
            const frame = from;
            const col = frame % meta.columns;
            const row = Math.floor(frame / meta.columns);

            this.img = image;
            this.frameSource = {
                sx: col * meta.frameWidth,
                sy: row * meta.frameHeight,
                sw: meta.frameWidth,
                sh: meta.frameHeight
            };
            return;
        }

        // 🔹 sheetSequence → nimm einfach den ersten Sheet+Frame
        if (anim.type === 'sheetSequence' && anim.sheets?.length) {
            const sheet = anim.sheets[0];
            const { image, meta, anim: overrideName2 } = sheet;
            const animName2 = overrideName2 ?? 'dead';
            const def =
                meta.animations?.[animName2] ??
                meta.animations?.default;

            const from = def?.from ?? 0;
            const frame = from;
            const col = frame % meta.columns;
            const row = Math.floor(frame / meta.columns);

            this.img = image;
            this.frameSource = {
                sx: col * meta.frameWidth,
                sy: row * meta.frameHeight,
                sw: meta.frameWidth,
                sh: meta.frameHeight
            };
        }
    }


    /**
     * Returns the image set for a given animation state.
     * @param {string} state - The current animation state.
     * @returns {Array<string>|undefined} The corresponding image set.
     */
    getAnimationImages(state) {
        switch (state) {
            case 'idle': return this.idle;
            case 'walk': return this.walk;
            case 'hurt': return this.hurt;
            case 'attack': return this.attack;
            case 'airApproach': return this.airApproach;
            case 'diveStart': return this.diveStart;
            case 'diveFast': return this.diveFast;
            case 'diveUpShallow': return this.diveUpShallow;
            case 'diveUpMedium': return this.diveUpMedium;
            case 'diveUpSteep': return this.diveUpSteep;
            case 'fallDown': return this.fallDown;
            case 'impact': return this.impact;
            case 'dead': return this.dead;
        }
    }

    applyNextFrame(images) {
        this.img = images[this.frameIndex % images.length];
        this.frameSource = null;  // wichtig: kein Sheet-Crop mehr benutzen
    }


    /**
     * Updates the current animation frame based on elapsed time.
     * @param {number} timestamp - Current time in milliseconds.
     */
    updateAnimation(timestamp) {
        this.handleAnimation();

        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;

        if (deltaTime <= this.frameInterval) return;

        const anim = this.getAnimationImages(this.currentAnimation);
        if (!anim) {
            this.lastFrameTime = timestamp;
            return;
        }

        const frameCount = this.getFrameCountFor(anim, this.currentAnimation);

        // 🔹 1) Einzelbilder (Array)
        if (Array.isArray(anim) && anim.length > 0) {
            this.applyNextFrame(anim);

            // hurt fertig?
            if (this.currentAnimation === 'hurt') {
                if (this.frameIndex >= anim.length - 1) {
                    this.isHurt = false;
                    this.frameIndex = 0;
                }
            }

            // dragonSmall impact fertig?
            if (this.currentEnemy === 'dragonSmall' &&
                this.isDead &&
                this.currentAnimation === 'impact') {

                if (this.frameIndex >= anim.length - 1) {
                    this.deathPhase = 'done';
                    this.frameIndex = 0;
                    this.lastFrameTime = timestamp;
                }
            }

            // Attack-Logik (Nah/Fern, Drache)
            this.handleAttackLogic(anim.length);

            this.frameIndex++;
        }

        // 🔹 2) Spritesheet-Sequenz
        else if (anim.type === 'sheetSequence') {
            const currentSheet = anim.sheets[this.sheetIndex];

            if (!currentSheet) {
                // Sicherheitsnetz, falls irgendwas schief geht
                this.animationFinished = true;
            } else {
                this.applyNextSheetFrame(currentSheet);

                const meta = currentSheet.meta;
                const def =
                    meta.animations?.[this.currentAnimation] ??
                    meta.animations?.default;

                const from = def?.from ?? 0;
                const to = def?.to ?? (meta.frames - 1);
                const count = to - from + 1;

                // Attack-Logik → Frames im aktuellen Sheet
                this.handleAttackLogic(count);

                this.frameIndex++;

                if (this.frameIndex >= count) {
                    this.frameIndex = 0;
                    this.sheetIndex++;

                    if (this.sheetIndex >= anim.sheets.length) {
                        if (anim.loop) {
                            this.sheetIndex = 0;
                        } else {
                            this.animationFinished = true;
                        }
                    }
                }
            }

            // hurt fertig? → über animationFinished
            if (this.currentAnimation === 'hurt' &&
                this.animationFinished &&
                !anim.loop) {

                this.isHurt = false;
                this.frameIndex = 0;
                this.sheetIndex = 0;
                this.animationFinished = false;
            }

            // dragonSmall impact fertig?
            if (this.currentEnemy === 'dragonSmall' &&
                this.isDead &&
                this.currentAnimation === 'impact' &&
                this.animationFinished) {

                this.deathPhase = 'done';
                this.frameIndex = 0;
                this.sheetIndex = 0;
                this.animationFinished = false;
            }
        }

        // 🔹 3) Einzelnes Spritesheet
        else if (anim.type === 'sheet') {
            this.applyNextSheetFrame(anim);

            // hurt fertig?
            if (this.currentAnimation === 'hurt' && frameCount > 0) {
                if (this.frameIndex >= frameCount - 1) {
                    this.isHurt = false;
                    this.frameIndex = 0;
                }
            }

            // dragonSmall impact fertig?
            if (this.currentEnemy === 'dragonSmall' &&
                this.isDead &&
                this.currentAnimation === 'impact' &&
                frameCount > 0) {

                if (this.frameIndex >= frameCount - 1) {
                    this.deathPhase = 'done';
                    this.frameIndex = 0;
                    this.lastFrameTime = timestamp;
                }
            }

            this.handleAttackLogic(frameCount);

            this.frameIndex++;
        }

        this.lastFrameTime = timestamp;
    }

    applyNextSheetFrame(sheet) {
        const { image, meta, anim } = sheet;

        const animName = anim ?? this.currentAnimation;
        const def =
            meta.animations?.[animName] ??
            meta.animations?.default;

        const from = def?.from ?? 0;
        const to = def?.to ?? (meta.frames - 1);
        const count = to - from + 1;

        const frame = from + (this.frameIndex % count);
        const col = frame % meta.columns;
        const row = Math.floor(frame / meta.columns);

        this.img = image;
        this.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
    }

    /** Ermittelt die Anzahl der Frames für aktuelle Animation (Array oder Sheet) */
    getFrameCountFor(anim, animName = this.currentAnimation) {
        if (!anim) return 0;

        // 🔹 Arrays
        if (Array.isArray(anim)) return anim.length;

        // 🔹 Einzel-Sheet
        if (anim.type === 'sheet') {
            const meta = anim.meta;
            const name = anim.anim ?? animName;
            const def =
                meta.animations?.[name] ??
                meta.animations?.default;

            const from = def?.from ?? 0;
            const to = def?.to ?? (meta.frames - 1);
            return to - from + 1;
        }

        // 🔹 Sequenz aus mehreren Sheets
        if (anim.type === 'sheetSequence') {
            let total = 0;

            for (const sheet of anim.sheets ?? []) {
                const meta = sheet.meta;
                const name = sheet.anim ?? animName;
                const def =
                    meta.animations?.[name] ??
                    meta.animations?.default;

                const from = def?.from ?? 0;
                const to = def?.to ?? (meta.frames - 1);
                total += (to - from + 1);
            }

            return total;
        }

        return 0;
    }

    handleAttackLogic(frameCount) {
        // ❗ falls wir keine Info zur Anzahl haben: nichts tun
        if (!frameCount || frameCount <= 0) return;

        // Fernangriff (chickenMutatesBig)
        if (this.isAttack && this.currentEnemy === "chickenMutatesBig") {
            if (this.isHurt || this.isDead) return;
            const shootFrame = 8;
            if (this.frameIndex === shootFrame && !this.hasFiredThisAttack) {
                const audio = this.allAudios.fireballShotSound.cloneNode();
                audio.play();
                this.shootProjectile("fireball", this.world.character);
                this.hasFiredThisAttack = true;
            }

            if (this.frameIndex >= frameCount - 1) {
                this.hasFiredThisAttack = false;
                this.isAttack = false;
                this.frameIndex = 0;
            }
        }

        // Nahkampf (chickenMutatesSmall)
        if (this.isAttack && this.currentEnemy === "chickenMutatesSmall") {
            if (this.isHurt || this.isDead) return;

            const hitFrame = 6;
            this.attackHitbox.active = (this.frameIndex === hitFrame);

            if (this.frameIndex >= frameCount - 1) {
                this.attackHitbox.active = false;
                this.isAttack = false;
                this.frameIndex = 0;
                this.hasHitPlayerThisAttack = false;
            }
        }

        // Biss-Attacke vom kleinen Drachen
        if (this.currentAnimation === 'attack' && this.currentEnemy === 'dragonSmall') {
            const biteFrame = 1;
            this.attackHitbox.active = (this.frameIndex === biteFrame);

            if (this.frameIndex >= frameCount - 1) {
                this.attackHitbox.active = false;
                this.isAttack = false;
                this.frameIndex = 0;
                this.hasHitPlayerThisAttack = false;
            }
        }
    }

    setAnimation(newAnim) {
        if (this.currentAnimation !== newAnim) {
            this.currentAnimation = newAnim;
            this.frameIndex = 0;
            this.sheetIndex = 0;
            this.animationFinished = false;
            this.lastFrameTime = null;
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
            !char.isProtect ? desired += 12 : desired += 22;   // kleiner Bonus, nicht zu groß (sonst zappelt er leichter)
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

    // dragonSmall
    updateDragonAI(timestamp, char) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        if (this.isDead || this.isHurt) return;

        if (this.airState !== 'approach') {
            this.approachBaseY = null;
        }

        const ex = this.x + this.width * 0.5;
        const tx = char.x + char.width * 0.5;
        const dx = tx - ex;
        const distX = Math.abs(dx);

        if (this.airState !== 'approach') {
            this.approachBaseY = null;
        }

        // 🔹 Wenn der Spieler ZU WEIT weg ist → zurück in idle
        const tooFarDistance = this.approachDistance * 1.6; // z.B. 1.4x weiter als "aggro range"
        if (
            distX > tooFarDistance &&
            (this.airState === 'approach' || this.airState === 'air_exit')
        ) {
            this.airState = 'idle';
            this.lockDirection = false;
            this.exitTimer = null;
        }

        switch (this.airState) {
            case 'idle':
                this.dragonIdleFollow(char, distX);

                // Sobald wieder in "Aggro-Reichweite", in approach wechseln
                if (distX <= this.approachDistance) {
                    this.airState = 'approach';
                    this.approachBaseY = null; // neue Basis beim nächsten dragonApproach
                }
                break;

            case 'approach':
                this.dragonApproach(char);

                if (distX <= this.attackDistance && this.canDragonAttack(timestamp)) {
                    const eBox = this.getHitboxRect();
                    const pBox = char.getHitboxRect();

                    this.entryDir = pBox.cx > eBox.cx ? 1 : -1;

                    // etwas höhere Tiefflug-Höhe, damit Hitbox schön trifft
                    const offsetOverPlayer = -140;
                    this.planeY = pBox.cy + offsetOverPlayer;

                    const preOffset = 140;
                    const postOffset = 140;

                    this.preDiveX = pBox.cx - this.entryDir * preOffset;
                    this.postDiveX = pBox.cx + this.entryDir * postOffset;

                    this.diveTargetX = this.preDiveX;
                    this.diveTargetY = this.planeY;

                    // 👉 HIER: horizontale Dive-Geschwindigkeit merken


                    this.lowApproachSpeed = this.flySpeed * 2.5;
                    this.lockDirection = true;
                    this.hasAttackedThisDive = false;
                    this.hasBeenHitThisDive = false;
                    this.airState = 'dive_start';
                    this.diveStartTime = timestamp;
                }
                break;



            case 'dive_start':
                this.dragonDive(char, timestamp);
                if (timestamp - this.diveStartTime >= this.diveStartDuration) {
                    this.airState = 'dive_fast';
                }
                break;

            case 'dive_fast': {
                const dt = this.deltaTime ?? 1 / 60;
                const eBox = this.getHitboxRect();

                const dx = this.diveTargetX - eBox.cx;
                const dy = this.diveTargetY - eBox.cy;
                const dist = Math.hypot(dx, dy) || 1;

                const step = this.diveSpeed * dt;

                if (dist <= step) {
                    // 1) Bis exakt zum Zielpunkt auf der Dive-Linie fliegen
                    this.x += dx;
                    this.y += dy;

                    // 2) Rest der Schrittweite in diesem Frame schon horizontal
                    const remaining = step - dist;
                    if (remaining > 0) {
                        this.x += this.entryDir * remaining;
                    }

                    // Richtung fürs Hochfliegen merken
                    this.exitDir = this.entryDir;
                    this.isFlipped = this.exitDir > 0;

                    // Direkt in den Low-Approach (wir liegen jetzt exakt auf planeY)
                    this.airState = 'approach_low';
                } else {
                    // normaler schräger Dive
                    this.x += (dx / dist) * step;
                    this.y += (dy / dist) * step;
                }
                break;
            }



            case 'retreat':
                this.dragonRetreat();
                break;

            case 'dive_up_shallow':
                this.dragonDiveUp(30);
                this.checkDiveUpEnd();
                break;

            case 'dive_up_medium':
                this.dragonDiveUp(50);
                this.checkDiveUpEnd();
                break;

            case 'dive_up_steep':
                this.dragonDiveUp(70);
                this.checkDiveUpEnd();
                break;
            case 'air_exit':
                this.exitTimer ??= timestamp;
                if (timestamp - this.exitTimer > 150) {
                    this.exitTimer = null;
                    this.airState = 'approach';
                    this.hasAttackedThisDive = false;
                }
                break;

            case 'approach_low': {
                const dt = this.deltaTime ?? 1 / 60;

                // immer exakt auf der Tiefflug-Höhe
                if (this.planeY != null) {
                    this.y = this.planeY;
                }

                // gleiche horizontale Speed wie der Dive
                const speed = this.lowApproachSpeed;
                this.x += this.entryDir * speed * dt;

                const eBox = this.getHitboxRect();
                const pBox = char.getHitboxRect();

                const rel = eBox.cx - pBox.cx;

                const triggerStart = 110;
                const triggerEnd = 10;

                let inBiteZone;
                if (this.entryDir === 1) {
                    inBiteZone = (rel <= -triggerEnd && rel >= -triggerStart);
                } else {
                    inBiteZone = (rel >= triggerEnd && rel <= triggerStart);
                }

                if (inBiteZone &&
                    !this.isAttack &&
                    !this.hasAttackedThisDive &&
                    this.canDragonAttack(timestamp)) {

                    this.isAttack = true;
                    this.hasHitPlayerThisAttack = false;
                    this.hasAttackedThisDive = true;

                    this.frameIndex = 0;
                    this.lastFrameTime = 0;

                    this.lastAttackTime = timestamp;
                    this.pendingDiveUpAngle = this.chooseDiveUpAngle(char);
                }

                const passedPost =
                    this.entryDir === 1
                        ? eBox.cx >= this.postDiveX
                        : eBox.cx <= this.postDiveX;

                if (passedPost && !this.isAttack) {
                    const angle = this.pendingDiveUpAngle || this.chooseDiveUpAngle(char);
                    this.pendingDiveUpAngle = null;
                    this.airState = `dive_up_${angle}`;
                }

                break;
            }


        }

    }

    // Approach bewegt IMMER – Angriff nur wenn Cooldown ok
    dragonApproach(char) {
        const pBox = char.getHitboxRect();
        const eBox = this.getHitboxRect();

        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;

        this.moveToX(targetX, {
            speed: this.flySpeed,
            snap: false,
            faceTarget: !this.lockDirection,
            target: char
        });

        if (this.approachBaseY == null) {
            this.approachBaseY = this.y; // aktuelle Höhe als Startpunkt
        }

        const amplitude = 12; // wie vorher
        this.y = this.approachBaseY + Math.sin(performance.now() / 300) * amplitude;
    }

    dragonIdleFollow(char, distX) {
        const pBox = char.getHitboxRect();
        const eBox = this.getHitboxRect();

        // Ziel-X: ungefähr mittig über dem Character
        const targetX = pBox.cx - (eBox.right - eBox.left) * 0.5;

        // Nur bewegen, wenn wir wirklich ein Stück weg sind (sonst Gezappel)
        const desiredDistX = 80; // in Pixeln
        const dx = pBox.cx - eBox.cx;
        if (Math.abs(dx) > desiredDistX) {
            this.moveToX(targetX, {
                speed: this.flySpeed * 0.5,   // langsamer als im Attack-Approach
                snap: false,
                faceTarget: !this.lockDirection,
                target: char
            });
        }

        // Vertikal: weich zurück in Richtung spawnY gleiten, kein harter Snap
        const dt = this.deltaTime ?? 1 / 60;
        const lerpSpeed = 2; // wie stark er pro Sekunde zu spawnY zurückzieht
        this.y += (this.spawnY - this.y) * Math.min(lerpSpeed * dt, 1);

        // ganz leichte Wobble, damit er nicht komplett statisch hängt
        this.y += Math.sin(performance.now() / 400) * 0.5;
    }

    dragonDive() {
        const eBox = this.getHitboxRect();

        const dx = this.diveTargetX - eBox.cx;
        const dy = this.diveTargetY - eBox.cy;
        const len = Math.hypot(dx, dy) || 1;

        const step = this.diveSpeed * (this.deltaTime ?? 1 / 60);
        this.x += (dx / len) * step;
        this.y += (dy / len) * step;
    }



    dragonRetreat() {
        const step = this.flySpeed * (this.deltaTime ?? 1 / 60);
        this.y -= step;

        if (this.y <= this.spawnY - this.retreatHeight) {
            this.y = this.spawnY - this.retreatHeight;

            // 🔥 WICHTIG: ZWANGSWECHSEL
            this.airState = 'approach';

            // Bewegung resetten
            this.isMovingLeft = false;
            this.isMovingRight = false;
        }
    }


    canDragonAttack(timestamp) {
        return (timestamp - this.lastAttackTime) > this.attackCooldownMs;
    }

    reachedDiveTarget() {
        const eBox = this.getHitboxRect();

        const dx = this.diveTargetX - eBox.cx;
        const dy = this.diveTargetY - eBox.cy;
        const dist = Math.hypot(dx, dy);

        const HIT_RADIUS = 20; // kannst du tunen (20–50)

        return dist <= HIT_RADIUS;
    }




    dragonDiveUp(angleDeg) {
        const rad = angleDeg * Math.PI / 180;

        const dx = Math.cos(rad) * this.exitDir;
        const dy = -Math.sin(rad);

        const climbSpeed = this.flySpeed * 3.5;
        const step = climbSpeed * (this.deltaTime ?? 1 / 60);
        this.x += dx * step;
        this.y += dy * step;
    }



    checkDiveUpEnd() {
        if (this.y <= this.spawnY - this.retreatHeight) {
            this.lockDirection = false;
            this.airState = 'air_exit';
        }
    }



    chooseDiveUpAngle(char) {
        const eBox = this.getHitboxRect();
        const pBox = char.getHitboxRect();

        const dx = Math.abs(pBox.cx - eBox.cx);
        const dy = pBox.cy - eBox.cy;

        if (dy > 40 && dx < 60) return 'steep';
        if (dx < 160) return 'medium';
        return 'shallow';
    }




}
