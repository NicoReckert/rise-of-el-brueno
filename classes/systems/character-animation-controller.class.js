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
     * Updates the character animation.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    updateAnimation(timestamp) {
        if (!this.char.lastFrameTime) this.char.lastFrameTime = timestamp;
        const dt = timestamp - this.char.lastFrameTime;
        if (dt <= this.char.frameInterval) return;
        this.stepCharacterAnimation(timestamp);
    }

    /**
     * Advances the character animation by one step.
     * @param {number} timestamp Frame timestamp.
     * @returns {void}
     */
    stepCharacterAnimation(timestamp) {
        const anim = this.char.getAnimationImages(this.char.currentAnimation);
        if (!anim) return void (this.char.lastFrameTime = timestamp);
        this.char.updateAnimationFromSourceGeneric(anim);
        this.char.handleDeferredSizeUpdate();
        if (this.char.animationFinished) {
            this.transitions.handleAnimationTransition(this.char.currentAnimation);
            this.char.animationFinished = false
        }
        this.updateAttackHitboxState();
        this.char.lastFrameTime = timestamp;
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
        if (this.handleStandUpAfterPainStunAnimation()) return true;
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
     * Handles stand-up-after-pain-stun animation transition.
     * @returns {boolean} True if the transition was handled, otherwise false.
     */
    handleStandUpAfterPainStunAnimation() {
        if (this.char.isStandUpAfterPainStun)
            return this.setAnim('stand-up-after-pain-stun', 5, 'attack-end-scene');
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
        if (this.char.isAttack)
            return this.setAnim(this.char.isHaveSword ? 'attack-sword' : 'attack-staff', this.char.isHaveSword ? 6 : 7);
        if (this.char.isAttackEndScene) return this.setAnim('attack-end-scene', 6, 'attack-end-scene-loop');
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