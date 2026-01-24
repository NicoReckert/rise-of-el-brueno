/**
 * Represents a playable or controllable character with movement, animations, and state handling.
 * Handles transitions, emotions, combat, and environmental interactions.
 * @extends MovableObject
 */
class Character extends MovableObject {
    VOIDLESS_ANIMS = new Set([
        'kneel-and-cry', 'stand-up-and-look-determined', 'cry', 'look-determined',
        'look-determined-and-stand-up', 'strong-determined', 'caress', 'caress-loop',
        'sit-down-and-play-guitar', 'play-guitar-and-sing', 'play-guitar',
        'light-a-campfire', 'meditation', 'meditation-loop', 'stand-up',
        'walk-determined', 'stand-determined', 'stand-determined-loop',
        'walk-in-storm', 'collapse', 'collapse-loop', 'stand-up-after-collapse', 'air-hit-stun', 'air-pain-stun'
    ]);
    TRANSITIONABLE_ANIMS = new Set([
        'kneel-and-cry', 'stand-up-and-look-determined', 'look-determined-and-stand-up',
        'caress', 'sit-down-and-play-guitar', 'light-a-campfire', 'attack', 'attack-sword',
        'meditation', 'new-weapon', 'stand-up', 'stand-determined', 'collapse', 'stand-up-after-collapse', 'protect', 'air-hit-stun', 'hurt'
    ]);

    /**
    * Creates a character instance with animation and movement settings.
    * @param {Object} characterImages - Image data for character animations.
    */
    constructor(characterImages) {
        super();
        this.characterImages = characterImages;
        this.speedX = 8;
        this.lastFrameTime = 0;
        this.currentAnimation = 'idle';
        this.frameInterval = 1000 / 2.5;
        this.frameIndex = 0;
        this.level_start_x = 440;
        this.yNormal = 370;
        this.yVoidless = 487;
        this.init();
        this.movementSpeed;

        this.isGamecharacter = true;
        this.isHaveSword = true;
        this.attackHitbox =
            !this.isHaveSword ?
                {
                    top: 220,     // Abstand von oben
                    left: 200,    // Abstand von links
                    right: 8,     // Abstand von rechts
                    bottom: 52,   // Abstand von unten
                    active: false
                }
                :
                {
                    top: 200,     // Abstand von oben
                    left: 200,    // Abstand von links
                    right: 8,     // Abstand von rechts
                    bottom: 65,   // Abstand von unten
                    active: false
                };

        this.hasHitEnemyThisAttack = false;
        this.isCapturedByTornado = false;

        this.hurtUntil = 0;
        this.invulnerableUntil = 0;
        this.touchingEnemies = new Set();
        this.lastAttackTime = null;
    }

    /**
    * Initializes character properties, images, and state configurations.
    */
    init() {
        this.setSizeAndPosition();
        this.setOffset();
        this.initMovementImages();
        this.initEmotionImages();
        this.initActionImages();
        this.initSpecialImages();
        this.initBasicStates();
        this.initMovementStates();
        this.initActionStates();
        this.initEmotionStates();
        this.initInteractionStates();
    }

    /**
    * Sets the character's size and initial position on the screen.
    */
    setSizeAndPosition() {
        this.height = 300; // 183 für voidless.dev sprite - 300 * 0.61
        this.width = 130; // 158 für voidless.dev sprite - 130 * 1.216
        this.x = 1000;
        this.y = 370; // 487 für voidless.dev sprite - 370 * 1.9
    }

    /**
    * Sets the character's collision or interaction offset values.
    */
    setOffset() {
        this.offset.top = 130;
        this.offset.left = 20;
        this.offset.right = 40;
        this.offset.bottom = 15;
    }

    /**
    * Initializes character movement-related image sets.
    */
    initMovementImages() {
        this.idleImages = this.characterImages.idleImages ?? (this.characterImages.idleImages = []);
        this.walkImages = this.characterImages.walkImages ?? (this.characterImages.walkImages = []);
        this.jumpImages = this.characterImages.jumpImages ?? (this.characterImages.jumpImages = []);
        this.walkDeterminedImages = this.characterImages.walkDeterminedImages ?? (this.characterImages.walkDeterminedImages = []);
        this.walkInStormImages = this.characterImages.walkInStormImages ?? (this.characterImages.walkInStormImages = []);
        this.standUpImages = this.characterImages.standUpImages ?? (this.characterImages.standUpImages = []);
    }

    /**
    * Initializes character emotion-related image sets.
    */
    initEmotionImages() {
        this.hurtImages = this.characterImages.hurtImages ?? (this.characterImages.hurtImages = []);
        this.deadImages = this.characterImages.deadImages ?? (this.characterImages.deadImages = []);
        this.kneelDownAndCryImages = this.characterImages.kneelDownAndCryImages ?? (this.characterImages.kneelDownAndCryImages = []);
        this.cryImages = this.characterImages.cryImages ?? (this.characterImages.cryImages = []);
        this.lookDeterminedImages = this.characterImages.lookDeterminedImages ?? (this.characterImages.lookDeterminedImages = []);
        this.lookDeterminedStandUpImages = this.characterImages.lookDeterminedStandUpImages ?? (this.characterImages.lookDeterminedStandUpImages = []);
        this.strongDeterminedImages = this.characterImages.strongDeterminedImages ?? (this.characterImages.strongDeterminedImages = []);
        this.standDeterminedImages = this.characterImages.standDeterminedImages ?? (this.characterImages.standDeterminedImages = []);
        this.standDeterminedLoopImages = this.characterImages.standDeterminedLoopImages ?? (this.characterImages.standDeterminedLoopImages = []);
        this.collapseImages = this.characterImages.collapseImages ?? (this.characterImages.collapseImages = []);
        this.collapseLoopImages = this.characterImages.collapseLoopImages ?? (this.characterImages.collapseLoopImages = []);
        this.standUpAfterCollapseImages = this.characterImages.standUpAfterCollapseImages ?? (this.characterImages.standUpAfterCollapseImages = []);
        this.airHitStunImages = this.characterImages.airHitStunImages ?? (this.characterImages.airHitStunImages = []);
        this.airPainStunImages = this.characterImages.airPainStunImages ?? (this.characterImages.airPainStunImages = []);
    }


    /**
    * Initializes character action-related image sets.
    */
    initActionImages() {
        this.attackImages = this.characterImages.attackImages ?? (this.characterImages.attackImages = []);
        this.attackSwordImages = this.characterImages.attackSwordImages ?? (this.characterImages.attackSwordImages = []);
        this.jetPackImages = this.characterImages.jetPackImages ?? (this.characterImages.jetPackImages = []);
        this.meditationImages = this.characterImages.meditationImages ?? (this.characterImages.meditationImages = []);
        this.meditationLoopImages = this.characterImages.meditationLoopImages ?? (this.characterImages.meditationLoopImages = []);
        this.newWeaponImages = this.characterImages.newWeaponImages ?? (this.characterImages.newWeaponImages = []);
        this.newWeaponLoopImages = this.characterImages.newWeaponLoopImages ?? (this.characterImages.newWeaponLoopImages = []);
        this.protectImages = this.characterImages.protectImages ?? (this.characterImages.protectImages = []);
        this.protectLoopImages = this.characterImages.protectLoopImages ?? (this.characterImages.protectLoopImages = []);
    }

    /**
    * Initializes character special interaction and event-related image sets.
    */
    initSpecialImages() {
        this.caressImages = this.characterImages.caressImages ?? (this.characterImages.caressImages = []);
        this.caressLoopImages = this.characterImages.caressLoopImages ?? (this.characterImages.caressLoopImages = []);
        this.sitDownAndPlayGuitarImages = this.characterImages.sitDownAndPlayGuitarImages ?? (this.characterImages.sitDownAndPlayGuitarImages = []);
        this.playGuitarAndSingImages = this.characterImages.playGuitarAndSingImages ?? (this.characterImages.playGuitarAndSingImages = []);
        this.playGuitarImages = this.characterImages.playGuitarImages ?? (this.characterImages.playGuitarImages = []);
        this.lightACampfireImages = this.characterImages.lightACampfireImages ?? (this.characterImages.lightACampfireImages = []);
        this.standUpAndLookDeterminedImages = this.characterImages.standUpAndLookDeterminedImages ?? (this.characterImages.standUpAndLookDeterminedImages = []);
    }

    /**
    * Initializes the character's basic state properties.
    */
    initBasicStates() {
        this.isFlipped = false;
        this.isMoving = false;
        this.isGameCharacter = true;
        this.throwableBottels = 0;
    }

    /**
    * Initializes the character's movement state flags.
    */
    initMovementStates() {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isWalk = false;
        this.isWalkDetermined = false;
        this.isWalkInStorm = false;
        this.isJumping = false;
        this.isLanding = false;
    }

    /**
    * Initializes the character's action state flags.
    */
    initActionStates() {
        this.isAttack = false;
        this.isStandUp = false;
        this.isStandDetermined = false;
        this.isNewWeapon = false;
        this.isDead = false;
        this.isHurt = false;
        this.isThrowing = false;
        this.isProtect = false;
    }

    /**
    * Initializes the character's emotion state flags.
    */
    initEmotionStates() {
        this.isMeditation = false;
        this.isKneelAndCry = false;
        this.isStandUpAndLookDetermined = false;
        this.isLookDeterminedAndStandUp = false;
        this.isCollapse = false;
        this.isStandUpAfterCollapse = false;
        this.isAirHitStun = false;
        this.isAirPainStun = false;
    }

    /**
    * Initializes the character's interaction state flags.
    */
    initInteractionStates() {
        this.isCaress = false;
        this.isSitDownAndPlayGuitar = false;
        this.isPlayGuitarAndSing = false;
        this.isPlayGuitar = false;
        this.isLightACampfire = false;
    }

    /**
    * Makes the character bounce by setting upward speed.
    */
    bounce() {
        this.speedY = 10;
    }

    /**
    * Updates the character's state, movement, camera, and animation each frame.
    * @param {number} timestamp - Current time in milliseconds.
    */
    updateState(timestamp) {
        this.prevBottom = this.y + this.height - (this.offset?.bottom || 0);
        if (this.movementLockUntil && timestamp < this.movementLockUntil) {
            this.isMovingLeft = false;
            this.isMovingRight = false;
        }
        if (this.isAirHitStun) {
            if (timestamp - this.airHitStunStart >= this.airHitStunDuration) {
                this.isAirHitStun = false;
                this.isCapturedByTornado = false;
            }

            // keine Bewegung/Steuerung
            this.isMovingLeft = false;
            this.isMovingRight = false;
            this.speedY = 0;

            // ✅ Animation trotzdem setzen
            this.handleCharacterAnimation();
            return;
        }
        if (this.isCapturedByTornado) {
            //   this.isMovingLeft = false;
            //   this.isMovingRight = false;
            this.speedY = 0;
            return; // keine Steuerung / keine Bewegung
        }
        this.updateDeltaTime(timestamp);
        if (this.knockbackVelocityX) {
            this.x += this.knockbackVelocityX;
            this.knockbackVelocityX *= 0.85; // Reibung
            if (Math.abs(this.knockbackVelocityX) < 0.5) {
                this.knockbackVelocityX = 0;
            }
        }

        this.handleMovement();
        this.clampCamera();
        this.handleCharacterAnimation();
    }

    /**
    * Updates the delta time and calculates the character's movement speed.
    * @param {number} timestamp - Current time in milliseconds.
    */
    updateDeltaTime(timestamp) {
        if (!this.lastUpdateTime) this.lastUpdateTime = timestamp;
        this.deltaTime = (timestamp - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = timestamp;
        this.movementSpeed = this.speedX * this.deltaTime * 60;
    }

    /**
    * Handles horizontal character movement based on input states.
    */
    handleMovement() {
        if (this.isMovingLeft) {
            this.moveLeft();
        } else if (this.isMovingRight) {
            this.moveRight();
        }
    }

    /**
    * Moves the character to the left and adjusts the camera position.
    */
    moveLeft() {
        const isMobile = window.innerWidth <= 900;
        const cameraOffset = isMobile ? 920 : 1060;
        const t = 0.05 * (this.deltaTime * 60);
        this.isFlipped = true;
        if (this.x > this.level_start_x) {
            this.x -= this.movementSpeed;
            this.world.camera_x += ((this.x - cameraOffset) - this.world.camera_x) * t;
        }
    }

    /**
    * Moves the character to the right and adjusts the camera position.
    */
    moveRight() {
        const isMobile = window.innerWidth <= 900;
        const cameraOffset = isMobile ? 150 : 100;
        const t = 0.05 * (this.deltaTime * 60);
        this.isFlipped = false;
        if (this.x < this.world.farmLevelSetup.farmLevel.level_end_x) {
            this.x += this.movementSpeed;
            this.world.camera_x += ((this.x - cameraOffset) - this.world.camera_x) * t;
        }
    }

    /**
    * Clamps the camera position within the level boundaries.
    */
    clampCamera() {
        const maxCameraX = this.world.farmLevelSetup.farmLevel.level_end_x - 720;
        this.world.camera_x = Math.max(0, Math.min(this.world.camera_x, maxCameraX));
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
        if (this.isKneelAndCry) return this.setAnim('kneel-and-cry', 5, 'cry');
        if (this.isStandUpAndLookDetermined)
            return this.setAnim('stand-up-and-look-determined', 6, 'look-determined');
        if (this.isLookDeterminedAndStandUp)
            return this.setAnim('look-determined-and-stand-up', 6, 'strong-determined');
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
                return this.setAnim('attack', 7);
            } else return this.setAnim('attack-sword', 6.5);
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
    * Updates the current animation frame based on elapsed time.
    * @param {number} timestamp - Current time in milliseconds.
    */
    updateAnimation(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.frameInterval) {
            const images = this.getAnimationImages(this.currentAnimation);
            if (images?.length > 0) {
                this.applyNextFrame(images);
                this.handleDeferredSizeUpdate();
                this.frameIndex++;
                this.checkAnimationEnd(images);



                if (this.currentAnimation === 'attack') {
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



            }
            this.lastFrameTime = timestamp;
        }
    }

    /**
    * Applies the next animation frame from the given image set.
    * @param {Array<string>} images - List of animation frame images.
    */
    applyNextFrame(images) {
        this.img = images[this.frameIndex % images.length];
    }

    /**
    * Updates the character's size and offsets after certain animations if needed.
    */
    handleDeferredSizeUpdate() {
        if (!this.deferSizeUpdate) return;

        const oldBottom = this.y + this.height; // ✅ Fußpunkt merken
        const anim = this.currentAnimation;

        if (this.isVoidlessAnimation(anim)) {
            this.setCharacterSize(
                158, 183, /* y ignored */ this.y,
                { top: 13, left: 33, right: 55, bottom: 15 }
            );
        } else if (this.isLargeAnimationA(anim)) {
            this.setCharacterSize(
                240, 280, /* y ignored */ this.y,  //240, 280
                { top: 110, left: 30, right: 115, bottom: 10 }
            );
        } else if (this.isLargeAnimationB(anim)) {
            this.setCharacterSize(
                270, 300, /* y ignored */ this.y,  //240, 280
                { top: 135, left: 35, right: 175, bottom: 15 }
            );

        } else if (anim === 'protect' || anim === 'protect-loop') {
            this.setCharacterSize(
                158, 183, /* y ignored */ this.y,  //240, 280
                { top: 20, left: 45, right: 40, bottom: 15 }
            );
        } else if (anim === 'new-weapon' || anim === 'new-weapon-loop') {
            this.setCharacterSize(
                300, 340, /* y ignored */ this.y,  //240, 280
                { top: 20, left: 45, right: 40, bottom: 15 }
            );



        } else {
            this.setCharacterSize(
                130, 300, /* y ignored */ this.y,
                { top: 130, left: 28, right: 40, bottom: 15 }
            );
        }

        // ✅ nach dem Rescale: Bottom wieder herstellen (kein Down-Snap)
        this.y = oldBottom - this.height;

        // z.B. in handleDeferredSizeUpdate() oder wenn isAttack true wird:
        if (this.currentAnimation === 'attack') {
            this.drawOffset = { x: 0, y: 0, flipX: -100 }; // Wert anpassen (-20 / -60 etc.)
        } else if (this.currentAnimation === 'attack-sword') {
            this.drawOffset = { x: 0, y: 0, flipX: -120 };
        } else if (this.currentAnimation === 'protect' || this.currentAnimation === 'protect-loop') {
            this.drawOffset = { x: -14, y: 0, flipX: 0 };
        } else {
            this.drawOffset = { x: 0, y: 0, flipX: 0 };
        }


        this.deferSizeUpdate = false;
    }


    /**
    * Checks if the given animation is a voidless-type animation.
    * @param {string} anim - Animation name.
    * @returns {boolean} True if the animation is voidless.
    */
    isVoidlessAnimation(anim) {
        return this.VOIDLESS_ANIMS.has(anim);
    }

    /**
    * Checks if the given animation is classified as a large animation.
    * @param {string} anim - Animation name.
    * @returns {boolean} True if the animation is large.
    */
    isLargeAnimationA(anim) {
        return ['attack'].includes(anim);
    }

    isLargeAnimationB(anim) {
        return ['attack-sword'].includes(anim);
    }

    /**
    * Sets the character's size, vertical position, and offset values.
    * @param {number} width - Character width.
    * @param {number} height - Character height.
    * @param {number} y - Vertical position on the screen.
    * @param {Object} offset - Collision or interaction offset values.
    */
    setCharacterSize(width, height, y, offset) {
        this.width = width;
        this.height = height;
        if (y !== undefined && y !== null) this.y = y;
        this.offset = offset;
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
            case 'stand-up-and-look-determined':
                return this.setTransition('look-determined', 5.5);
            case 'look-determined-and-stand-up':
                return this.setTransition('strong-determined', 4);
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
                return this.setTransition('cry');
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
            case 'attack':
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
    * Retrieves the appropriate image set for the given animation state.
    * @param {string} state - The current animation state.
    * @returns {Array<string>} The list of images for the specified state.
    */
    getAnimationImages(state) {
        return (
            this.getMovementImages(state) ??
            this.getEmotionImages(state) ??
            this.getDeterminedImages(state) ??
            this.getMusicImages(state) ??
            this.getCombatImages(state) ??
            this.getSpecialImages(state) ??
            this.idleImages
        );
    }

    /**
    * Returns the image set for the specified movement-related animation state.
    * @param {string} state - The current movement animation state.
    * @returns {Array<string>|null} The corresponding image set or null if not found.
    */
    getMovementImages(state) {
        switch (state) {
            case 'walk': return this.walkImages;
            case 'jump': return this.jumpImages;
            case 'stand-up': return this.standUpImages;
            case 'walk-determined': return this.walkDeterminedImages;
            case 'walk-in-storm': return this.walkInStormImages;
        }
        return null;
    }

    /**
    * Returns the image set for the specified emotion-related animation state.
    * @param {string} state - The current emotional animation state.
    * @returns {Array<string>|null} The corresponding image set or null if not found.
    */
    getEmotionImages(state) {
        switch (state) {
            case 'dead': return this.deadImages;
            case 'hurt': return this.hurtImages;
            case 'kneel-and-cry': return this.kneelDownAndCryImages;
            case 'cry': return this.cryImages;
            case 'collapse': return this.collapseImages;
            case 'collapse-loop': return this.collapseLoopImages;
            case 'stand-up-after-collapse': return this.standUpAfterCollapseImages;
            case 'air-hit-stun': return this.airHitStunImages;
            case 'air-pain-stun': return this.airPainStunImages;
        }
        return null;
    }

    /**
    * Returns the image set for the specified determined or confident animation state.
    * @param {string} state - The current determined animation state.
    * @returns {Array<string>|null} The corresponding image set or null if not found.
    */
    getDeterminedImages(state) {
        switch (state) {
            case 'stand-up-and-look-determined': return this.standUpAndLookDeterminedImages;
            case 'look-determined': return this.lookDeterminedImages;
            case 'look-determined-and-stand-up': return this.lookDeterminedStandUpImages;
            case 'strong-determined': return this.strongDeterminedImages;
            case 'stand-determined': return this.standDeterminedImages;
            case 'stand-determined-loop': return this.standDeterminedLoopImages;
        }
        return null;
    }

    /**
    * Returns the image set for the specified music or interaction-related animation state.
    * @param {string} state - The current music animation state.
    * @returns {Array<string>|null} The corresponding image set or null if not found.
    */
    getMusicImages(state) {
        switch (state) {
            case 'caress': return this.caressImages;
            case 'caress-loop': return this.caressLoopImages;
            case 'sit-down-and-play-guitar': return this.sitDownAndPlayGuitarImages;
            case 'play-guitar-and-sing': return this.playGuitarAndSingImages;
            case 'play-guitar': return this.playGuitarImages;
            case 'light-a-campfire': return this.lightACampfireImages;
        }
        return null;
    }

    /**
    * Returns the image set for the specified combat or meditation-related animation state.
    * @param {string} state - The current combat animation state.
    * @returns {Array<string>|null} The corresponding image set or null if not found.
    */
    getCombatImages(state) {
        switch (state) {
            case 'attack': return this.attackImages;
            case 'attack-sword': return this.attackSwordImages;
            case 'meditation': return this.meditationImages;
            case 'meditation-loop': return this.meditationLoopImages;
            case 'new-weapon': return this.newWeaponImages;
            case 'new-weapon-loop': return this.newWeaponLoopImages;
            case 'protect': return this.protectImages;
            case 'protect-loop': return this.protectLoopImages;
        }
        return null;
    }

    /**
    * Returns the image set for special or default animation states.
    * @param {string} state - The current special animation state.
    * @returns {Array<string>|null} The corresponding image set or null if not found.
    */
    getSpecialImages(state) {
        switch (state) {
            case 'idle': return this.idleImages;
        }
        return null;
    }

    /**
    * Sets a new animation and resets related animation state properties.
    * @param {string} newAnimation - The name of the new animation to set.
    */
    setAnimation(newAnimation) {
        if (this.currentAnimation !== newAnimation) {
            this.currentAnimation = newAnimation;
            this.frameIndex = 0;
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

    startAirHitStun(timestamp, duration = 100000) {
        this.isAirHitStun = true;
        this.airHitStunStart = timestamp;
        this.airHitStunDuration = duration;

        // Input/Movement lock:
        this.isCapturedByTornado = true;
        this.speedY = 0;
        this.isJumping = false;
    }

    moveToX(targetX, {
        tolerance = 3,
        snap = true,
        speed = 5,          // px pro Frame @60fps
        faceTarget = true,
        setWalkFlag = false,
        onArrive = null
    } = {}) {
        const d = targetX - this.x;

        if (faceTarget) this.isFlipped = d < 0;
        if (setWalkFlag) this.isWalk = Math.abs(d) > tolerance;

        if (Math.abs(d) <= tolerance) {
            this.isWalk = false;
            if (snap) this.x = targetX;
            onArrive?.();
            return true;
        }

        const step = speed * (this.deltaTime ?? 1 / 60) * 60;
        this.x += Math.sign(d) * step;
        return false;
    }

    moveToY(targetY, {
        tolerance = 2,
        snap = true,
        speed = 1.5,        // px pro Frame @60fps
        onArrive = null
    } = {}) {
        const d = targetY - this.y;

        if (Math.abs(d) <= tolerance) {
            if (snap) this.y = targetY;
            onArrive?.();
            return true;
        }

        const step = speed * (this.deltaTime ?? 1 / 60) * 60;
        this.y += Math.sign(d) * step;
        return false;
    }

    clampX(object, minX, maxX) {
        if (object.x < minX) object.x = minX;
        if (object.x > maxX) object.x = maxX;
    }

    hit2(timestamp, dmg = 10) {
        if (this.isDead || this.isHurt) return;
        if (timestamp < this.invulnerableUntil) return;

        // Schaden
        this.energy = Math.max(0, this.energy - dmg);

        // i-frames
        this.invulnerableUntil = timestamp + 650;

        // ❗ WENN PROTECT → KEIN HURT
        if (this.isProtect) {
            // Optional: kleines Block-Feedback
            this.setAnimation('protect-loop');
            return;
        }

        // Hurt nur wenn NICHT protect
        if (!this.isHurt) {
            this.isHurt = true;
            this.hurtUntil = timestamp + 450;
            this.setAnimation('hurt');
        }
    }

    handleEnemyTouch(enemy, colliding, timestamp, {
        dmg = 10,
        knockX = 70,
        knockY = 18,
        lockMs = 260
    } = {}) {


        // --- Kontakt beendet → Reset
        if (!colliding) {
            this.touchingEnemies.delete(enemy);
            return false;
        }

        // --- Noch im Kontakt → kein Dauerschaden
        if (this.touchingEnemies.has(enemy)) return false;
        this.touchingEnemies.add(enemy);

        // i-frames / dead
        if (this.isDead) return false;
        if (timestamp < this.invulnerableUntil) return false;

        // 🛡️ PROTECT → blockt alles
        if (this.isProtect || this.isAttack) {
            this.invulnerableUntil = timestamp + 250;
            return false;
        }

        // 💥 Schaden + Hurt
        this.hit2(timestamp, dmg);

        // 🔥 KNOCKBACK-RICHTUNG
        const dir = enemy.x < this.x ? 1 : -1;

        // 👉 SOFORTIGE Distanz
        this.x += dir * knockX;

        // ⬆️ Hit-Jump
        this.isJumping = true;
        this.isLanding = false;
        this.speedY = Math.max(this.speedY, knockY);

        // 🧊 Bewegung kurz sperren
        this.movementLockUntil = timestamp + lockMs;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isAttack = false;
        this.isProtect = false;

        // Gravity sauber starten
        this.lastGravityUpdate = timestamp;

        return true;
    }

    updateAttackHitbox(weapon) {
        switch (weapon) {
            case 'staff':
                this.attackHitbox =
                {
                    top: 220,     // Abstand von oben
                    left: 200,    // Abstand von links
                    right: 8,     // Abstand von rechts
                    bottom: 52,   // Abstand von unten
                    active: false
                }
                break;

            case 'sword':
                this.attackHitbox =
                {
                    top: 200,     // Abstand von oben
                    left: 200,    // Abstand von links
                    right: 8,     // Abstand von rechts
                    bottom: 65,   // Abstand von unten
                    active: false
                }
                break;
        }
    }
}