export class CharacterAnimationController {
    /**
     * @param {Character} character
     */
    constructor(character) {
        this.char = character;

    }

    /**
* Updates the current animation frame based on elapsed time.
* @param {number} timestamp - Current time in milliseconds.
*/
    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.frameInterval) {
            const anim = this.getAnimationImages(this.currentAnimation);
            if (!anim) return;

            // 🔹 FALL 1: Einzelbilder (Array)
            if (Array.isArray(anim) && anim.length > 0) {
                this.applyNextFrame(anim);
                this.handleDeferredSizeUpdate();
                this.frameIndex++;
                this.checkAnimationEnd(anim);
            }

            else if (anim.type === 'sheetSequence') {
                const currentSheet = anim.sheets[this.sheetIndex];

                this.applyNextSheetFrame(currentSheet);
                this.frameIndex++;

                const def =
                    currentSheet.meta.animations?.[this.currentAnimation] ??
                    currentSheet.meta.animations?.default;

                const from = def?.from ?? 0;
                const to = def?.to ?? (currentSheet.meta.frames - 1);
                const count = to - from + 1;

                if (this.frameIndex >= count) {
                    this.frameIndex = 0;
                    this.sheetIndex++;

                    // Ende der Sequenz?
                    if (this.sheetIndex >= anim.sheets.length) {
                        if (anim.loop) {
                            this.sheetIndex = 0;
                        } else {
                            this.animationFinished = true;
                            this.handlePostAnimation(this.currentAnimation);
                        }
                    }
                }
            }

            // 🔹 FALL 2: Spritesheet
            else if (anim.type === 'sheet') {
                this.applyNextSheetFrame(anim);
                this.handleDeferredSizeUpdate();
                this.frameIndex++;

                // Animation-Ende für Sheets
                const animName = anim.anim ?? this.currentAnimation;
                const def =
                    anim.meta.animations?.[animName] ??
                    anim.meta.animations?.default;

                if (def) {
                    const from = def.from ?? 0;
                    const to = def.to ?? (anim.meta.frames - 1);
                    const frameCount = to - from + 1;

                    if (this.frameIndex >= frameCount) {
                        if (def.loop) {
                            this.frameIndex = 0;
                        } else {
                            this.animationFinished = true;
                            this.handleAnimationTransition(this.currentAnimation);
                        }
                    }
                }



            }
            if (this.currentAnimation === 'attack-staff') {
                // Aktiv bei jedem 6. Frame (Frame 6 → Index 6)
                const everySixthFrame = this.frameIndex % 6 === 0 && this.frameIndex !== 0;
                this.attackHitbox.active = everySixthFrame;

                if (this.frameIndex >= 6) {
                    this.frameIndex = 0;
                }

            } else if (this.currentAnimation === 'attack-sword') {
                // Aktiv bei jedem 4. Frame (Frame 4 → Index 4)
                const everyFourthFrame = this.frameIndex % 4 === 0 && this.frameIndex !== 0;
                this.attackHitbox.active = everyFourthFrame;

                if (this.frameIndex >= 4) {
                    this.frameIndex = 0;
                }

            } else {
                this.attackHitbox.active = false;
            }







            this.lastFrameTime = timestamp;
        }
    }

    /**
* Handles character animation logic based on current states and actions.
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
    * Handles death and jump animations.
    * @returns {boolean} Whether an animation was handled.
    */
    handleDeathOrJump() {
        if (this.isDead) return this.setAnim('dead', 6);
        if (this.isHurt) return this.setAnim('hurt', 6);
        if (this.isJumping) return this.setAnim('jump', 10);
        return false;
    }

    /**
    * Handles emotional animations such as crying, determination, or caressing.
    * @returns {boolean} Whether an emotional animation was handled.
    */
    handleEmotionalAnimations() {
        if (this.isCaress) return this.setAnim('caress', 6, 'caress-loop');
        if (this.isKneelAndCry) return this.setAnim('kneel-and-cry', 5, 'kneel-and-cry-loop');
        if (this.isStandUpAndLookDetermined)
            return this.setAnim('stand-up-determined', 6, 'stand-up-determined-loop');
        if (this.isLookDeterminedAndStandUp)
            return this.setAnim('determined-rise', 6, 'determined-rise-loop');
        if (this.isStandDetermined)
            return this.setAnim('stand-determined', 5, 'stand-determined-loop');
        if (this.isCollapse) return this.setAnim('collapse', 6, 'collapse-loop');
        if (this.isStandUpAfterCollapse) return this.setAnim('stand-up-after-collapse', 4);
        if (this.isAirHitStun) return this.setAnim('air-hit-stun', 5, 'air-pain-stun');
        return false;
    }

    /**
    * Handles music-related animations such as playing guitar or lighting a campfire.
    * @returns {boolean} Whether a music animation was handled.
    */
    handleMusicAnimations() {
        if (this.isSitDownAndPlayGuitar)
            return this.setAnim('sit-down-and-play-guitar', 6, 'play-guitar');
        if (this.isPlayGuitar) return this.setAnim('play-guitar', 10);
        if (this.isPlayGuitarAndSing) return this.setAnim('play-guitar-and-sing', 10);
        if (this.isLightACampfire)
            return this.setAnim('light-a-campfire', 6, 'sit-down-and-play-guitar');
        return false;
    }

    /**
    * Handles combat and meditation animations.
    * @returns {boolean} Whether a combat or meditation animation was handled.
    */
    handleCombatAndMeditation() {
        if (this.isAttack) {
            if (!this.isHaveSword) {
                return this.setAnim('attack-staff', 7);
            } else return this.setAnim('attack-sword', 6);
        }
        if (this.isMeditation) return this.setAnim('meditation', 6, 'meditation-loop');
        if (this.isNewWeapon) return this.setAnim('new-weapon', 6, 'new-weapon-loop');
        if (this.isStandUp) return this.setAnim('stand-up', 4);
        if (this.isProtect) return this.setAnim('protect', 10, 'protect-loop');
        return false;
    }

    /**
    * Handles movement animations such as walking or determined walking.
    * @returns {boolean} Whether a movement animation was handled.
    */
    handleMovementAnimations() {
        if (this.isMovingLeft || this.isMovingRight || this.isWalk)
            return this.isWalkInStorm ? this.setAnim('walk-in-storm', 5) : this.setAnim('walk', 8);
        if (this.isWalkDetermined)
            return this.setAnim('walk-determined', 5);
        return false;
    }

    /**
    * Sets a new animation with a specified frame rate.
    * @param {string} name - The name of the animation to set.
    * @param {number} fps - Frames per second for the animation speed.
    * @param {string} [skipIf=null] - Optional animation name to skip if currently active.
    * @returns {boolean} Always returns true after setting or skipping the animation.
    */
    setAnim(name, fps, skipIf = null) {
        if (skipIf && this.currentAnimation === skipIf) return true;
        this.setAnimation(name);
        this.frameInterval = 1000 / fps;
        return true;
    }

    /**
    * Sets a simple animation with the given name and frame rate.
    * @param {string} name - Animation name.
    * @param {number} fps - Frames per second.
    * @returns {boolean} True after setting the animation.
    */
    setSimpleAnim(name, fps) {
        this.currentAnimation = name;
        this.frameInterval = 1000 / fps;
        return true;
    }



    /**
    * Checks if the current animation has finished and triggers transitions if applicable.
    * @param {Array<string>} images - List of animation frame images.
    */
    checkAnimationEnd(images) {
        if (this.frameIndex < images.length) return;
        if (!this.TRANSITIONABLE_ANIMS.has(this.currentAnimation)) return;
        this.animationFinished = true;
        this.handleAnimationTransition(this.currentAnimation);
    }

    /**
    * Handles transitions between animations after one finishes.
    * @param {string} anim - The name of the completed animation.
    */
    handleAnimationTransition(anim) {
        if (this.handleDeterminedTransitions(anim)) return;
        if (this.handleEmotionalTransitions(anim)) return;
        if (this.handleMusicTransitions(anim)) return;
        if (this.handleCombatTransitions(anim)) return;
    }

    /**
    * Handles animation transitions related to determined or standing-up states.
    * @param {string} anim - The name of the completed animation.
    * @returns {boolean} Whether a transition was applied.
    */
    handleDeterminedTransitions(anim) {
        switch (anim) {
            case 'stand-up-determined':
                return this.setTransition('stand-up-determined-loop', 5.5);
            case 'determined-rise':
                return this.setTransition('determined-rise-loop', 4);
            case 'stand-up':
                this.isStandUp = false;
                return true;
            case 'stand-determined':
                return this.setTransition('stand-determined-loop');
        }
        return false;
    }

    /**
    * Handles animation transitions for emotional states such as crying or caressing.
    * @param {string} anim - The name of the completed animation.
    * @returns {boolean} Whether an emotional transition was applied.
    */
    handleEmotionalTransitions(anim) {
        switch (anim) {
            case 'hurt':
                this.isHurt = false;
                return true;
            case 'kneel-and-cry':
                return this.setTransition('kneel-and-cry-loop');
            case 'caress':
                return this.setTransition('caress-loop', 6);
            case 'collapse':
                return this.setTransition('collapse-loop', 5);
            case 'stand-up-after-collapse':
                this.isStandUpAfterCollapse = false;
            case 'air-hit-stun':
                return this.setTransition('air-pain-stun', 5);
        }
        return false;
    }

    /**
    * Handles animation transitions related to music actions such as playing guitar or lighting a campfire.
    * @param {string} anim - The name of the completed animation.
    * @returns {boolean} Whether a music transition was applied.
    */
    handleMusicTransitions(anim) {
        switch (anim) {
            case 'sit-down-and-play-guitar':
                return this.setTransition('play-guitar', 10);
            case 'light-a-campfire':
                this.isLightACampfire = false;
                this.isSitDownAndPlayGuitar = true;
                return this.setTransition('sit-down-and-play-guitar', 4);
        }
        return false;
    }

    /**
    * Handles animation transitions for combat and meditation states.
    * @param {string} anim - The name of the completed animation.
    * @returns {boolean} Whether a combat-related transition was applied.
    */
    handleCombatTransitions(anim) {
        switch (anim) {
            case 'attack-staff':
                this.isAttack = false;
                this.hasHitEnemyThisAttack = false;
                return true;
            case 'attack-sword':
                this.isAttack = false;
                this.hasHitEnemyThisAttack = false;
                return true;
            case 'meditation':
                return this.setTransition('meditation-loop', 4);
            case 'new-weapon':
                return this.setTransition('new-weapon-loop', 6);
            case 'protect':
                return this.setTransition('protect-loop', 6);
        }
        return false;
    }

    /**
    * Transitions to a new animation, optionally adjusting its frame rate.
    * @param {string} name - The name of the animation to transition to.
    * @param {number} [fps=null] - Optional frames per second for the new animation.
    * @returns {boolean} True after setting the transition.
    */
    setTransition(name, fps = null) {
        this.setAnimation(name);
        if (fps) this.frameInterval = 1000 / fps;
        return true;
    }

    /**
    * Sets a new animation and resets related animation state properties.
    * @param {string} newAnimation - The name of the new animation to set.
    */
    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;
            this.sheetIndex = 0;
            this.animationFinished = false;
            this.lastFrameTime = null;
            this.deferSizeUpdate = true;
        }
    }

    /**
    * Resets the character's timing variables for updates and animations.
    */
    resetTimers() {
        this.lastUpdateTime = null;
        this.lastFrameTime = null;
    }

}