/**
 * Controls animation behavior of an endboss.
 */
export class EndbossAnimationController {
    /**
     * Creates a new instance.
     * @param {*} endboss Reference to the endboss object.
     */
    constructor(endboss) {
        this.endboss = endboss;
    }

    /**
     * Updates animations based on the current state.
     * @returns {void}
     */
    handleStateAnimations() {
        if (this.endboss.isFindsPeace) return this.playFindsPeace();
        if (this.endboss.isDead) return this.playDeathAnimation();
        if (this.endboss.isHurt) return this.playHurtAnimation();
        if (this.endboss.isFireBreath) return this.setAnimation('fireBreathAttack', 5);
        if (this.endboss.isRage) return this.playRageAnimation();
        if (this.endboss.isFly) return this.playFlyAnimation();
        if (this.endboss.isFireballAttack) return this.playFireballAttackAnimation()
        if (this.endboss.isJumping) return this.setAnimation('jump', 10);
        if (this.endboss.isMovingLeft || this.endboss.isMovingRight)
            return this.setAnimation('walk', 8);
        this.setAnimation('idle', 8);
    }

    /**
     * Updates the current animation frame.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateAnimation(timestamp) {
        this.initLastFrameTime(timestamp);
        if (this.isFrameTooEarly(timestamp)) return;
        const anim = this.getAnimationImages(this.endboss.currentAnimation);
        if (!anim) {
            this.endboss.lastFrameTime = timestamp;
            return;
        }
        const prevFrame = this.endboss.frameIndex;
        this.updateCurrentAnimation(anim);
        this.handleFireballProjectile(prevFrame);
        this.updateDeadAnimationReady();
        this.endboss.lastFrameTime = timestamp;
    }

    /**
     * Initializes the last frame timestamp.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    initLastFrameTime(timestamp) {
        if (this.endboss.lastFrameTime) return;
        this.endboss.lastFrameTime = timestamp;
    }

    /**
     * Checks whether it is too early to advance the animation frame.
     * @param {number} timestamp Frame timestamp.
     * @returns {boolean} True if the frame update should be skipped, otherwise false.
     */
    isFrameTooEarly(timestamp) {
        const deltaTime = timestamp - this.endboss.lastFrameTime;
        return deltaTime <= this.endboss.frameInterval;
    }

    /**
     * Updates the current animation if no transition is handled.
     * @param {*} anim Animation source.
     * @returns {void}
     */
    updateCurrentAnimation(anim) {
        const handled = this.tryHandleAnimationTransition(anim);
        if (handled) return;
        this.endboss.updateAnimationFromSourceGeneric(anim);
    }

    /**
     * Checks whether the current animation transition should be handled.
     * @param {*} anim Animation source.
     * @returns {boolean} True if the transition was handled, otherwise false.
     */
    tryHandleAnimationTransition(anim) {
        if (this.endboss.currentAnimation === 'rage') {
            this.endboss.updateAnimationFromSourceGeneric(anim, {
                isOneShot: true,
                onFinished: () => this.setAnimation('rageLoop', 6)
            });
            return true;
        }
        return false;
    }

    /**
     * Handles projectile spawning during the fireball attack animation.
     * @param {number} prevFrame Previous animation frame index.
     * @returns {void}
     */
    handleFireballProjectile(prevFrame) {
        if (!this.endboss.isFireballAttack) return;
        const shootFrame = 13;
        if (prevFrame !== shootFrame) return;
        if (this.endboss.hasFiredThisAttack) return;
        const audio = this.endboss.allAudios.fireballShotSfx.cloneNode();
        audio.play();
        const target = this.endboss.world?.character;
        this.endboss.combatCtrl?.shootProjectile(target);
        this.endboss.hasFiredThisAttack = true;
    }

    /**
     * Updates the readiness state of the death animation.
     * @returns {void}
     */
    updateDeadAnimationReady() {
        if (this.endboss.currentAnimation !== 'dead') return;
        const animDead = this.endboss.deadImages;
        if (!animDead) return;
        if (animDead.type === 'sheetSequence') {
            this.updateDeadSheetReady();
        } else {
            this.updateDeadFramesReady(animDead);
        }
    }

    /**
     * Marks death animation as ready when finished.
     * @returns {void}
     */
    updateDeadSheetReady() {
        if (!this.endboss.animationFinished) return;
        this.endboss.isDeadAnimationReady = true;
    }

    /**
     * Marks death animation as ready when the last frame is reached.
     * @param {*} animDead Death animation source.
     * @returns {void}
     */
    updateDeadFramesReady(animDead) {
        const frameCount =
            this.endboss.getFrameCountForSource(animDead, 'dead');
        if (!frameCount) return;
        if (this.endboss.frameIndex < frameCount - 1) return;
        this.endboss.isDeadAnimationReady = true;
    }

    /**
     * Plays the finds peace animation.
     * @returns {void}
     */
    playFindsPeace() {
        this.setAnimation('findsPeace', 6);
        const anim = this.endboss.findsPeaceImages;
        if (!anim) return;
        if (anim.type === 'sheetSequence') {
            this.handleFindsPeaceSheet();
        } else {
            this.handleFindsPeaceFrames(anim);
        }
    }

    /**
     * Handles sheet-based finds peace animation completion.
     * @returns {void}
     */
    handleFindsPeaceSheet() {
        if (!this.endboss.animationFinished) return;
        if (this.endboss.currentAnimation !== 'findsPeace') return;
        this.resetFindsPeaceSheetState();
    }

    /**
     * Resets state after the finds peace sheet animation.
     * @returns {void}
     */
    resetFindsPeaceSheetState() {
        this.endboss.isFindsPeace = false;
        this.endboss.frameIndex = 0;
        this.endboss.sheetIndex = 0;
        this.endboss.animationFinished = false;
    }

    /**
     * Handles frame-based finds peace animation completion.
     * @param {*} anim Finds peace animation source.
     * @returns {void}
     */
    handleFindsPeaceFrames(anim) {
        const count = this.endboss.getFrameCountForSource(anim, 'findsPeace');
        if (!count) return;
        if (this.endboss.frameIndex < count) return;
        this.endboss.isFindsPeace = false;
        this.endboss.frameIndex = 0;
    }

    /**
     * Plays the death animation or clears it when finished.
     * @returns {void}
     */
    playDeathAnimation() {
        if (!this.endboss.isDeadAnimationReady) {
            this.setAnimation('dead', 4);
        } else {
            this.endboss.currentAnimation = null;
        }
    }

    /**
     * Plays the hurt animation.
     * @returns {void}
     */
    playHurtAnimation() {
        this.setAnimation('hurt', 4);
        const anim = this.endboss.hurtImages;
        if (!anim) return;
        if (anim.type === 'sheetSequence') {
            this.handleHurtSheet();
        } else {
            this.handleHurtFrames(anim);
        }
    }

    /**
     * Handles sheet-based hurt animation completion.
     * @returns {void}
     */
    handleHurtSheet() {
        if (!this.endboss.animationFinished) return;
        if (this.endboss.currentAnimation !== 'hurt') return;
        this.resetHurtSheetState();
    }

    /**
     * Resets state after the hurt sheet animation.
     * @returns {void}
     */
    resetHurtSheetState() {
        this.endboss.isHurt = false;
        this.endboss.frameIndex = 0;
        this.endboss.sheetIndex = 0;
        this.endboss.animationFinished = false;
    }

    /**
     * Handles frame-based hurt animation completion.
     * @param {*} anim Hurt animation source.
     * @returns {void}
     */
    handleHurtFrames(anim) {
        const count = this.endboss.getFrameCountForSource(anim, 'hurt');
        if (!count) return;
        if (this.endboss.frameIndex < count) return;
        this.endboss.isHurt = false;
        this.endboss.frameIndex = 0;
    }

    /**
     * Plays the fly animation.
     * @returns {void}
     */
    playFlyAnimation() {
        this.setAnimation('fly', 6);
    }

    /**
     * Plays the fireball attack animation.
     * @returns {void}
     */
    playFireballAttackAnimation() {
        this.setAnimation('fireballAttack', 5);
        const anim = this.endboss.fireballAttackImages;
        if (!anim) return;
        if (anim.type === 'sheetSequence') {
            this.handleFireballAttackSheet();
        } else {
            this.handleFireballAttackFrames(anim);
        }
    }

    /**
     * Plays the rage state animation.
     * @returns {*} Result of setting the animation.
     */
    playRageAnimation() {
        if (this.endboss.currentAnimation === 'rageLoop') {
            return this.setAnimation('rageLoop', 6);
        }
        return this.setAnimation('rage', 6);
    }

    /**
     * Handles sheet-based fireball attack animation completion.
     * @returns {void}
     */
    handleFireballAttackSheet() {
        if (!this.endboss.animationFinished) return;
        if (this.endboss.currentAnimation !== 'fireballAttack') return;
        this.resetFireballAttackSheetState();
    }

    /**
     * Resets state after the fireball attack sheet animation.
     * @returns {void}
     */
    resetFireballAttackSheetState() {
        this.endboss.isFireballAttack = false;
        this.endboss.hasFiredThisAttack = false;
        this.endboss.frameIndex = 0;
        this.endboss.sheetIndex = 0;
        this.endboss.animationFinished = false;
    }

    /**
     * Handles frame-based fireball attack animation completion.
     * @param {*} anim Fireball attack animation source.
     * @returns {void}
     */
    handleFireballAttackFrames(anim) {
        const count = this.endboss.getFrameCountForSource(
            anim,
            'fireballAttack'
        );
        if (!count) return;
        if (this.endboss.frameIndex < count) return;
        this.endboss.isFireballAttack = false;
        this.endboss.hasFiredThisAttack = false;
        this.endboss.frameIndex = 0;
    }

    /**
     * Sets the current animation and frame rate.
     * @param {string} name Animation name.
     * @param {number} fps Frames per second.
     * @returns {void}
     */
    setAnimation(name, fps) {
        if (this.endboss.currentAnimation !== name) {
            this.endboss.currentAnimation = name;
            this.endboss.frameIndex = 0;
            this.endboss.sheetIndex = 0;
            this.endboss.animationFinished = false;
            this.endboss.lastFrameTime = null;
        }
        if (fps) {
            this.endboss.frameInterval = 1000 / fps;
        }
    }

    /**
     * Returns animation images for the given state.
     * @param {string} state Animation state name.
     * @returns {*} Animation image source.
     */
    getAnimationImages(state) {
        switch (state) {
            case 'dead': return this.endboss.deadImages;
            case 'hurt': return this.endboss.hurtImages;
            case 'fly': return this.endboss.flyImages;
            case 'jump': return this.endboss.jumpImages;
            case 'walk': return this.endboss.walkImages;
            case 'findsPeace': return this.endboss.findsPeaceImages;
            case 'fireballAttack': return this.endboss.fireballAttackImages;
            case 'fireBreathAttack': return this.endboss.fireBreathAttackImages;
            case 'rage':
            case 'rageLoop':
                return this.endboss.rageImages;
            case 'idle': return this.endboss.idleImages;
        }
    }
}