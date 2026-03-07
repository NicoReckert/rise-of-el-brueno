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
     * Handles enemy animation based on the current state.
     * @returns {void}
     */
    handleAnimation() {
        const isDragonSmall = this.enemy.currentEnemy === 'dragonSmall';
        if (this.enemy.isDead) {
            if (isDragonSmall) this.handleDragonDeathAnimation();
            else this.enemy.animTransitionsCtrl.playDeathAnimation();
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
        this.enemy.animAttackCtrl.handleAttackLogic(prevFrame, frameCount);
        this.enemy.animTransitionsCtrl.handleAnimationEnd(anim, frameCount, timestamp);
        this.enemy.lastFrameTime = timestamp;
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