export class EnemyAnimationController {
    constructor() {

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
}