/**
 * Controls animation state for an enemy.
 */
export class EnemyAnimationController {
    /**
    * Creates a new instance.
    * @param {object} enemy Enemy instance.
    */
    constructor(enemy) {
        this.enemy = enemy;
        this.initDragonAnimMap();
        this.initEnemyAnimMap();
    }

    /**
    * Handles enemy animation based on the current state.
    * @returns {void}
    */
    handleAnimation() {
        const isDragonSmall = this.enemy.currentEnemy === 'dragonSmall';
        if (this.enemy.isDead) {
            if (isDragonSmall) this.handleDragonDeathAnimation();
            else this.playDeathAnimation();
            return;
        }
        if (isDragonSmall) this.handleDragonAnimation();
        else this.handleDefaultAnimation();
    }

    /**
    * Handles dragon death animation.
    * @returns {void}
    */
    handleDragonDeathAnimation() {
        if (this.enemy.deathPhase === 'fall') {
            this.setAnimation('fallDown', 12);
            return;
        }
        if (this.enemy.deathPhase === 'impact') {
            this.setAnimation('impact', 15);
            return;
        }
        this.setAnimation('dead', 4);
    }

    /**
    * Initializes the dragon animation map.
    * @returns {void}
    */
    initDragonAnimMap() {
        this.dragonAirAnimMap = {
            idle: ['idle', 6], retreat: ['idle', 6],
            approach: ['airApproach', 6], approach_low: ['airApproach', 6],
            dive_start: ['diveStart', 7], dive_fast: ['diveFast', 9],
            attack: ['attack', 6.5],
            dive_up_shallow: ['diveUpShallow', 7], dive_up_medium: ['diveUpMedium', 8],
            dive_up_steep: ['diveUpSteep', 9],
            fall_down: ['fallDown', 6.5], impact: ['impact', 6.5]
        };
    }

    /**
    * Handles dragon animation based on the current state.
    * @returns {void}
    */
    handleDragonAnimation() {
        if (this.enemy.isHurt) { this.setAnimation('hurt', 10); return; }
        if (this.enemy.isAttack) { this.setAnimation('attack', 6.5); return; }
        const map = this.dragonAirAnimMap;
        if (!map) return;
        const cfg = map[this.enemy.airState];
        if (!cfg) return;
        this.setAnimation(cfg[0], cfg[1]);
    }

    /**
    * Handles default enemy animation based on the current state.
    * @returns {void}
    */
    handleDefaultAnimation() {
        const e = this.enemy;
        const moving = e.isMovingLeft || e.isMovingRight;
        const [name, speed] =
            e.isAttack ? ['attack', 5] :
                e.isHurt ? ['hurt', 6] :
                    moving ? ['walk', 5] :
                        ['idle', 5];
        this.setAnimation(name, speed);
    }

    /**
    * Plays the death animation.
    * @returns {void}
    */
    playDeathAnimation() {
        if (this.enemy.currentEnemy === 'dragonSmall') return;
        const anim = this.enemy.dead;
        if (!anim) return;
        this.enemy.currentAnimation = null;
        this.enemy.y = 565;
        this.applyDeathFirstFrame(anim);
    }

    /**
    * Applies the first frame of the death animation.
    * @param {Array|object} anim Animation source.
    * @returns {void}
    */
    applyDeathFirstFrame(anim) {
        if (Array.isArray(anim) && anim.length > 0) {
            this.enemy.img = anim[0];
            this.enemy.frameSource = null;
            return;
        }
        if (anim.type === 'sheet') {
            this.applyFirstFrameFromSheet(anim, 'dead');
            return;
        }
        if (anim.type === 'sheetSequence' && anim.sheets?.length) {
            this.applyFirstFrameFromSheet(anim.sheets[0], 'dead');
        }
    }

    /**
    * Applies the first frame from a sheet animation source.
    * @param {object} sheet Sheet animation source.
    * @param {string} [fallbackAnimName='dead'] Fallback animation name.
    * @returns {void}
    */
    applyFirstFrameFromSheet(sheet, fallbackAnimName = 'dead') {
        const { image, meta, anim } = sheet;
        const animKey = anim ?? fallbackAnimName;
        const def =
            meta.animations?.[animKey] ??
            meta.animations?.default ??
            { from: 0 };
        const frame = def.from ?? 0;
        const { frameWidth, frameHeight, columns } = meta;
        const col = frame % columns;
        const row = Math.floor(frame / columns);
        this.enemy.img = image;
        this.enemy.frameSource = this.buildFrameSourceFromGrid(col, row, frameWidth, frameHeight);
    }

    /**
    * Builds a frame source object from grid coordinates.
    * @param {number} col Grid column.
    * @param {number} row Grid row.
    * @param {number} frameWidth Frame width.
    * @param {number} frameHeight Frame height.
    * @returns {object} Frame source object.
    */
    buildFrameSourceFromGrid(col, row, frameWidth, frameHeight) {
        return {
            sx: col * frameWidth,
            sy: row * frameHeight,
            sw: frameWidth,
            sh: frameHeight
        };
    }

    /**
    * Initializes the enemy animation map.
    * @returns {void}
    */
    initEnemyAnimMap() {
        this.enemyAnimMap = {
            idle: "idle", walk: "walk", hurt: "hurt", attack: "attack",
            airApproach: "airApproach", diveStart: "diveStart",
            diveFast: "diveFast", diveUpShallow: "diveUpShallow",
            diveUpMedium: "diveUpMedium", diveUpSteep: "diveUpSteep",
            fallDown: "fallDown", impact: "impact", dead: "dead"
        };
    }

    /**
    * Returns the animation images for the given state.
    * @param {string} state Animation state.
    * @returns {*} Animation images.
    */
    getAnimationImages(state) {
        const key = this.enemyAnimMap?.[state];
        return key ? this.enemy[key] : undefined;
    }

    /**
    * Updates the animation based on the given timestamp.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    updateAnimation(timestamp) {
        this.handleAnimation();
        if (this.shouldSkipFrame(timestamp)) return;
        const anim = this.getAnimationImages(this.enemy.currentAnimation);
        if (!anim) { this.enemy.lastFrameTime = timestamp; return; }
        this.runAnimationStep(timestamp, anim);
    }

    /**
    * Checks whether the current animation frame should be skipped.
    * @param {number} timestamp Frame timestamp.
    * @returns {boolean} True if the frame should be skipped, otherwise false.
    */
    shouldSkipFrame(timestamp) {
        if (!this.enemy.lastFrameTime) this.enemy.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.enemy.lastFrameTime;
        return deltaTime <= this.enemy.frameInterval;
    }

    /**
    * Runs one animation update step.
    * @param {number} timestamp Frame timestamp.
    * @param {*} anim Animation source.
    * @returns {void}
    */
    runAnimationStep(timestamp, anim) {
        const prevFrame = this.enemy.frameIndex;
        this.enemy.updateAnimationFromSourceGeneric(anim);
        const frameCount = this.enemy.getFrameCountForSource(
            anim,
            this.enemy.currentAnimation
        );
        this.handleAttackLogic(prevFrame, frameCount);
        this.handleAnimationEnd(anim, frameCount, timestamp);
        this.enemy.lastFrameTime = timestamp;
    }

    /**
    * Handles animation end logic.
    * @param {*} anim Animation source.
    * @param {number} frameCount Number of animation frames.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    handleAnimationEnd(anim, frameCount, timestamp) {
        this.handleHurtAnimationEnd(anim, frameCount);
        this.handleDragonImpactAnimationEnd(anim, frameCount, timestamp);
    }

    /**
    * Handles the end of the hurt animation.
    * @param {*} anim Animation source.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleHurtAnimationEnd(anim, frameCount) {
        if (this.enemy.currentAnimation !== "hurt") return;
        if (anim.type === "sheetSequence") {
            this.handleHurtSheetEnd(anim);
            return;
        }
        this.handleHurtFramesEnd(frameCount);
    }

    /**
    * Handles the end of a sheet-based hurt animation.
    * @param {*} anim Animation source.
    * @returns {void}
    */
    handleHurtSheetEnd(anim) {
        if (!this.enemy.animationFinished || anim.loop) return;
        this.enemy.isHurt = false;
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
    }

    /**
    * Handles the end of a frame-based hurt animation.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleHurtFramesEnd(frameCount) {
        if (!frameCount) return;
        if (this.enemy.frameIndex < frameCount - 1) return;
        this.enemy.isHurt = false;
        this.enemy.frameIndex = 0;
    }

    /**
    * Handles the end of the dragon impact animation.
    * @param {*} anim Animation source.
    * @param {number} frameCount Number of animation frames.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    handleDragonImpactAnimationEnd(anim, frameCount, timestamp) {
        if (!this.isDragonImpactState()) return;
        if (anim.type === "sheetSequence") {
            this.finishDragonImpactSheet();
            return;
        }
        this.finishDragonImpactFrames(frameCount, timestamp);
    }

    /**
    * Checks whether the enemy is in the dragon impact state.
    * @returns {boolean} True if the enemy is in the dragon impact state, otherwise false.
    */
    isDragonImpactState() {
        if (this.enemy.currentEnemy !== "dragonSmall") return false;
        if (!this.enemy.isDead) return false;
        if (this.enemy.currentAnimation !== "impact") return false;
        return true;
    }

    /**
    * Finishes the dragon impact sheet animation if completed.
    * @returns {void}
    */
    finishDragonImpactSheet() {
        if (!this.enemy.animationFinished) return;
        this.setDragonImpactDone();
    }

    /**
    * Finishes the dragon impact frame animation if completed.
    * @param {number} frameCount Number of animation frames.
    * @param {number} timestamp Frame timestamp.
    * @returns {void}
    */
    finishDragonImpactFrames(frameCount, timestamp) {
        if (!frameCount) return;
        if (this.enemy.frameIndex < frameCount - 1) return;
        this.setDragonImpactDone();
        this.enemy.lastFrameTime = timestamp;
    }

    /**
    * Marks the dragon impact animation as completed.
    * @returns {void}
    */
    setDragonImpactDone() {
        this.enemy.deathPhase = "done";
        this.enemy.frameIndex = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
    }

    /**
    * Handles attack-related animation logic.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleAttackLogic(prevFrame, frameCount) {
        if (!frameCount || frameCount <= 0) return;
        this.handleBigChickenAttack(prevFrame, frameCount);
        this.handleSmallChickenAttack(prevFrame, frameCount);
        this.handleDragonAttack(prevFrame, frameCount);
    }

    /**
    * Handles big chicken attack logic during the animation.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleBigChickenAttack(prevFrame, frameCount) {
        if (!this.shouldProcessBigChickenAttack()) return;
        const shootFrame = 8;
        if (this.shouldShootNow(prevFrame, shootFrame)) {
            this.fireBigChickenProjectile();
        }
        if (this.enemy.frameIndex < frameCount) return;
        this.resetBigChickenAttackState();
    }

    /**
    * Checks whether big chicken attack logic should be processed.
    * @returns {boolean} True if big chicken attack logic should be processed, otherwise false.
    */
    shouldProcessBigChickenAttack() {
        const e = this.enemy;
        if (!e.isAttack) return false;
        if (e.currentEnemy !== "chickenMutatesBig") return false;
        if (e.isHurt || e.isDead) return false;
        return true;
    }

    /**
    * Checks whether the enemy should fire the projectile in this frame.
    * @param {number} prevFrame Previous frame index.
    * @param {number} shootFrame Frame index at which to shoot.
    * @returns {boolean} True if the projectile should be fired, otherwise false.
    */
    shouldShootNow(prevFrame, shootFrame) {
        if (prevFrame !== shootFrame) return false;
        if (this.enemy.hasFiredThisAttack) return false;
        return true;
    }

    /**
    * Fires the projectile for the big chicken attack.
    * @returns {void}
    */
    fireBigChickenProjectile() {
        const e = this.enemy;
        const audio = e.allAudios.fireballShotSound.cloneNode();
        audio.play();
        e.shootProjectile("fireball", e.world.character);
        e.hasFiredThisAttack = true;
    }

    /**
    * Resets the big chicken attack state.
    * @returns {void}
    */
    resetBigChickenAttackState() {
        this.enemy.hasFiredThisAttack = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
    }

    /**
    * Handles small chicken attack logic during the animation.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleSmallChickenAttack(prevFrame, frameCount) {
        if (!this.enemy.isAttack || this.enemy.currentEnemy !== 'chickenMutatesSmall') return;
        if (this.enemy.isHurt || this.enemy.isDead) return;
        const hitFrame = 6;
        this.enemy.attackHitbox.active = prevFrame === hitFrame;
        if (this.enemy.frameIndex < frameCount) return;
        this.enemy.attackHitbox.active = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
        this.enemy.hasHitPlayerThisAttack = false;
    }

    /**
    * Handles dragon attack logic during the animation.
    * @param {number} prevFrame Previous frame index.
    * @param {number} frameCount Number of animation frames.
    * @returns {void}
    */
    handleDragonAttack(prevFrame, frameCount) {
        if (this.enemy.currentAnimation !== 'attack') return;
        if (this.enemy.currentEnemy !== 'dragonSmall') return;
        const biteFrame = 1;
        this.enemy.attackHitbox.active = prevFrame === biteFrame;
        if (this.enemy.frameIndex < frameCount) return;
        this.enemy.attackHitbox.active = false;
        this.enemy.isAttack = false;
        this.enemy.frameIndex = 0;
        this.enemy.hasHitPlayerThisAttack = false;
    }

    /**
    * Sets the current animation and optionally updates the frame rate.
    * @param {string} newAnim Animation state.
    * @param {?number} [fps=null] Animation frame rate.
    * @returns {void}
    */
    setAnimation(newAnim, fps = null) {
        if (this.enemy.currentAnimation !== newAnim) {
            this.enemy.currentAnimation = newAnim;
            this.enemy.frameIndex = 0;
            this.enemy.sheetIndex = 0;
            this.enemy.animationFinished = false;
            this.enemy.lastFrameTime = null;
        }
        if (fps) {
            this.enemy.frameInterval = 1000 / fps;
        }
    }
}