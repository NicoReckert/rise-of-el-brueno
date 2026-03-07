import { CharacterAnimationTransitions } from "./character-animation-transitions.class.js";

/**
 * Controls character animations.
 */
export class CharacterAnimationController {
    /**
     * Creates a new instance.
     * @param {Object} character Character instance.
     */
    constructor(character) {
        this.char = character;
        this.transitions = new CharacterAnimationTransitions(character, this);
    }

    /**
     * Updates the current animation frame.
     * @param {number} timestamp Frame timestamp.
     */
    updateAnimation(timestamp) {
        if (!this.char.lastFrameTime) this.char.lastFrameTime = timestamp;
        const dt = timestamp - this.char.lastFrameTime;
        if (dt <= this.char.frameInterval) return;
        const anim = this.char.getAnimationImages(this.char.currentAnimation);
        if (!anim) {
            this.char.lastFrameTime = timestamp;
            return;
        }
        this.updateAnimationFromSource(anim);
        this.updateAttackHitboxState();
        this.char.lastFrameTime = timestamp;
    }

    /**
     * Updates animation based on the provided source.
     * @param {*} anim Animation source definition.
     */
    updateAnimationFromSource(anim) {
        if (Array.isArray(anim)) {
            if (!anim.length) return;
            this.handleArrayAnimation(anim);
            return;
        }
        if (anim.type === 'sheetSequence') {
            this.handleSheetSequence(anim);
            return;
        }
        if (anim.type === 'sheet') {
            this.handleSheet(anim);
        }
    }

    /**
     * Handles animation defined as an image array.
     * @param {Array} images Animation frame images.
     */
    handleArrayAnimation(images) {
        this.char.applyNextFrame(images);
        this.char.handleDeferredSizeUpdate();
        this.char.frameIndex++;
        this.checkAnimationEnd(images);
    }

    /**
     * Handles animation defined as a sheet sequence.
     * @param {Object} anim Animation definition.
     */
    handleSheetSequence(anim) {
        const sheet = anim.sheets[this.char.sheetIndex];
        if (!sheet) return;
        this.char.applyNextSheetFrame(sheet);
        this.char.frameIndex++;
        const def = this.getSheetDef(sheet.meta, this.char.currentAnimation);
        const count = this.getFrameCount(def, sheet.meta.frames);
        if (this.char.frameIndex >= count) {
            this.advanceSheetSequence(anim);
        }
    }

    /**
     * Returns the sprite sheet animation definition.
     * @param {Object} meta Sprite sheet metadata.
     * @param {string} animName Animation state identifier.
     * @returns {Object} Animation definition.
     */
    getSheetDef(meta, animName) {
        const anims = meta.animations ?? {};
        return anims[animName] ?? anims.default ?? {
            from: 0,
            to: meta.frames - 1
        };
    }

    /**
     * Calculates the frame count for a sprite sheet animation.
     * @param {Object} def Animation definition.
     * @param {number} totalFrames Total number of frames in the sheet.
     * @returns {number} Frame count.
     */
    getFrameCount(def, totalFrames) {
        const from = def.from ?? 0;
        const to = def.to ?? (totalFrames - 1);
        return to - from + 1;
    }

    /**
     * Advances the sprite sheet sequence or finalizes the animation.
     * @param {Object} anim Animation definition.
     */
    advanceSheetSequence(anim) {
        this.char.frameIndex = 0;
        this.char.sheetIndex++;
        if (this.char.sheetIndex < anim.sheets.length) return;
        if (anim.loop) {
            this.char.sheetIndex = 0;
            return;
        }
        this.char.animationFinished = true;
        this.transitions.handlePostAnimation(this.char.currentAnimation);
    }

    /**
     * Handles animation defined as a single sprite sheet.
     * @param {Object} anim Animation definition.
     */
    handleSheet(anim) {
        this.char.applyNextSheetFrame(anim);
        this.char.handleDeferredSizeUpdate();
        this.char.frameIndex++;
        const name = anim.anim ?? this.char.currentAnimation;
        const def = this.getSheetDef(anim.meta, name);
        const count = this.getFrameCount(def, anim.meta.frames);
        if (this.char.frameIndex >= count) {
            this.handleSheetLoopOrEnd(def);
        }
    }

    /**
     * Handles looping or ending behavior for a sprite sheet animation.
     * @param {Object} def Animation definition.
     */
    handleSheetLoopOrEnd(def) {
        if (def.loop) {
            this.char.frameIndex = 0;
            return;
        }
        this.char.animationFinished = true;
        this.transitions.handleAnimationTransition(this.char.currentAnimation);
    }

    /**
     * Updates the attack hitbox state based on the current animation.
     */
    updateAttackHitboxState() {
        const anim = this.char.currentAnimation;
        if (anim === 'attack-staff') {
            this.updateStaffHitbox();
        } else if (anim === 'attack-sword') {
            this.updateSwordHitbox();
        } else {
            this.char.attackHitbox.active = false;
        }
    }

    /**
     * Updates the staff attack hitbox state.
     */
    updateStaffHitbox() {
        const frame = this.char.frameIndex;
        const active = frame % 6 === 0 && frame !== 0;
        this.char.attackHitbox.active = active;
        if (frame >= 6) this.char.frameIndex = 0;
    }

    /**
     * Updates the sword attack hitbox state.
     */
    updateSwordHitbox() {
        const frame = this.char.frameIndex;
        const active = frame % 4 === 0 && frame !== 0;
        this.char.attackHitbox.active = active;
        if (frame >= 4) this.char.frameIndex = 0;
    }

    /**
     * Determines and applies the appropriate character animation.
     */
    handleCharacterAnimation() {
        if (this.handleDeathOrJump()) return;
        if (this.handleEmotionalAnimations()) return;
        if (this.handleMusicAnimations()) return;
        if (this.handleCombatAndMeditation()) return;
        if (this.handleMovementAnimations()) return;
        this.setAnim('idle', 2.5);
    }

    /**
     * Handles death, hurt, or jump animations.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleDeathOrJump() {
        if (this.char.isDead) return this.setAnim('dead', 6);
        if (this.char.isHurt) return this.setAnim('hurt', 6);
        if (this.char.isJumping) return this.setAnim('jump', 10);
        return false;
    }

    /**
     * Handles emotional animation states.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleEmotionalAnimations() {
        if (this.handleCareAndGrief()) return true;
        if (this.handleDeterminedAndCollapse()) return true;
        if (this.handleAirStunAnimation()) return true;
        return false;
    }

    /**
     * Handles care and grief related animations.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleCareAndGrief() {
        if (this.char.isCaress)
            return this.setAnim('caress', 6, 'caress-loop');
        if (this.char.isKneelAndCry)
            return this.setAnim('kneel-and-cry', 5, 'kneel-and-cry-loop');
        if (this.char.isStandUpAndLookDetermined)
            return this.setAnim('stand-up-determined', 6, 'stand-up-determined-loop');
        if (this.char.isLookDeterminedAndStandUp)
            return this.setAnim('determined-rise', 6, 'determined-rise-loop');
        return false;
    }

    /**
     * Handles determined stance and collapse animations.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleDeterminedAndCollapse() {
        if (this.char.isStandDetermined)
            return this.setAnim('stand-determined', 5, 'stand-determined-loop');
        if (this.char.isCollapse)
            return this.setAnim('collapse', 6, 'collapse-loop');
        if (this.char.isStandUpAfterCollapse)
            return this.setAnim('stand-up-after-collapse', 4);
        return false;
    }

    /**
     * Handles air hit stun animation.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleAirStunAnimation() {
        if (this.char.isAirHitStun)
            return this.setAnim('air-hit-stun', 5, 'air-pain-stun');
        return false;
    }

    /**
     * Handles music-related animations.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleMusicAnimations() {
        if (this.char.isSitDownAndPlayGuitar)
            return this.setAnim('sit-down-and-play-guitar', 6, 'play-guitar');
        if (this.char.isPlayGuitar) return this.setAnim('play-guitar', 10);
        if (this.char.isPlayGuitarAndSing) return this.setAnim('play-guitar-and-sing', 10);
        if (this.char.isLightACampfire)
            return this.setAnim('light-a-campfire', 6, 'sit-down-and-play-guitar');
        return false;
    }

    /**
     * Handles combat and meditation-related animations.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleCombatAndMeditation() {
        if (this.char.isAttack) {
            if (!this.char.isHaveSword) {
                return this.setAnim('attack-staff', 7);
            } else return this.setAnim('attack-sword', 6);
        }
        if (this.char.isThrowing) return this.setAnim('throw', 10);
        if (this.char.isHealing) return this.setAnim('heal', 6);
        if (this.char.isMeditation) return this.setAnim('meditation', 6, 'meditation-loop');
        if (this.char.isNewWeapon) return this.setAnim('new-weapon', 6, 'new-weapon-loop');
        if (this.char.isStandUp) return this.setAnim('stand-up', 4);
        if (this.char.isProtect) return this.setAnim('protect', 10, 'protect-loop');
        return false;
    }

    /**
     * Handles movement-related animations.
     * @returns {boolean} True if an animation was applied, otherwise false.
     */
    handleMovementAnimations() {
        if (this.char.duckState === 'enter') return this.setAnim('duck-enter', 16);
        if (this.char.duckState === 'loop') {
            const moving = this.char.isMovingLeft || this.char.isMovingRight;
            return moving ? this.setAnim('duck-walk', 8) : this.setAnim('duck-loop', 6);
        }
        if (this.char.duckState === 'exit') return this.setAnim('duck-exit', 16);
        if (this.char.isMovingLeft || this.char.isMovingRight || this.char.isWalk)
            return this.char.isWalkInStorm ? this.setAnim('walk-in-storm', 5) : this.setAnim('walk', 8);
        if (this.char.isWalkDetermined)
            return this.setAnim('walk-determined', 5);
        return false;
    }

    /**
     * Sets the current animation.
     * @param {string} name Animation state identifier.
     * @param {number} fps Frames per second.
     * @param {?string} [skipIf=null] Animation name to skip if already active.
     * @returns {boolean} Always returns true.
     */
    setAnim(name, fps, skipIf = null) {
        if (skipIf && this.char.currentAnimation === skipIf) return true;
        this.setAnimation(name);
        this.char.frameInterval = 1000 / fps;
        return true;
    }

    /**
     * Sets a simple animation without transition handling.
     * @param {string} name Animation state identifier.
     * @param {number} fps Frames per second.
     * @returns {boolean} Always returns true.
     */
    setSimpleAnim(name, fps) {
        this.char.currentAnimation = name;
        this.char.frameInterval = 1000 / fps;
        return true;
    }

    /**
     * Checks whether the current animation has ended.
     * @param {Array} images Animation frame images.
     */
    checkAnimationEnd(images) {
        if (this.char.frameIndex < images.length) return;
        if (!this.char.TRANSITIONABLE_ANIMS.has(this.char.currentAnimation)) return;
        this.char.animationFinished = true;
        this.transitions.handleAnimationTransition(this.char.currentAnimation);
    }

    /**
     * Sets the current animation and resets animation state.
     * @param {string} newAnimation Animation state identifier.
     */
    setAnimation(newAnimation) {
        if (this.char.currentAnimation !== newAnimation) {
            this.char.currentAnimation = newAnimation;
            this.char.frameIndex = 0;
            this.char.sheetIndex = 0;
            this.char.animationFinished = false;
            this.char.lastFrameTime = null;
            this.char.deferSizeUpdate = true;
        }
    }

    /**
     * Resets animation and update timers.
     */
    resetTimers() {
        this.char.lastUpdateTime = null;
        this.char.lastFrameTime = null;
    }

    /**
     * Syncs the current animation visual state.
     * @returns {void}
     */
    syncCurrentAnimationVisual() {
        const anim = this.char.getAnimationImages(this.char.currentAnimation);
        if (!anim) return;

        this.char.applyFirstFrameOfSource(anim, this.char.currentAnimation);
        this.char.handleDeferredSizeUpdate();
    }
}