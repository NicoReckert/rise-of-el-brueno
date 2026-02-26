/**
 * Configures character properties and assets.
 */
export class CharacterConfig {
    /**
    * Creates a new instance.
    * @param {Object} character Character instance.
    * @param {Object} characterImages Character image assets.
    */
    constructor(character, characterImages) {
        this.char = character;
        this.images = characterImages;
    }

    /**
    * Initializes character properties, images, and state configurations.
    */
    initAll() {
        this.initCoreValues();
        this.setSizeAndPosition();
        this.setOffset();
        this.initImages();
        this.initStates();
        this.initCombatConfig();
        this.initAnimationSets();
    }

    /**
    * Initializes animation set definitions.
    */
    initAnimationSets() {
        this.initVoidlessAnimations();
        this.initTransitionableAnimations();
    }

    /**
    * Initializes animations that are not affected by void state.
    */
    initVoidlessAnimations() {
        this.char.VOIDLESS_ANIMS = new Set([
            'kneel-and-cry', 'stand-up-determined', 'kneel-and-cry-loop', 'stand-up-determined-loop',
            'determined-rise', 'determined-rise-loop', 'caress', 'caress-loop',
            'sit-down-and-play-guitar', 'play-guitar-and-sing', 'play-guitar', 'light-a-campfire',
            'meditation', 'meditation-loop', 'stand-up', 'walk-determined', 'stand-determined',
            'stand-determined-loop', 'walk-in-storm',
            'collapse', 'collapse-loop', 'stand-up-after-collapse',
            'air-hit-stun', 'air-pain-stun'
        ]);
    }
    /**
    * Initializes animations that support transitions.
    */
    initTransitionableAnimations() {
        this.char.TRANSITIONABLE_ANIMS = new Set([
            'kneel-and-cry', 'stand-up-determined', 'determined-rise', 'caress',
            'sit-down-and-play-guitar', 'light-a-campfire', 'attack-staff', 'attack-sword',
            'meditation', 'new-weapon', 'stand-up', 'stand-determined',
            'collapse', 'stand-up-after-collapse', 'protect', 'air-hit-stun', 'hurt'
        ]);
    }

    /**
    * Initializes core character values.
    */
    initCoreValues() {
        this.initCoreMovementValues();
        this.initCoreStateValues();
    }

    /**
    * Initializes core movement-related values.
    */
    initCoreMovementValues() {
        this.char.speedX = 8;
        this.char.lastFrameTime = 0;
        this.char.currentAnimation = 'idle';
        this.char.frameInterval = 1000 / 2.5;
        this.char.frameIndex = 0;
        this.char.level_start_x = 440;
        this.char.yNormal = 370;
        this.char.yVoidless = 487;
        this.char.sheetIndex = 0;
    }

    /**
    * Initializes core state-related values.
    */
    initCoreStateValues() {
        this.char.isGamecharacter = true;
        this.char.isHaveSword = true;
        this.char.hasHitEnemyThisAttack = false;
        this.char.isCapturedByTornado = false;
        this.char.hurtUntil = 0;
        this.char.invulnerableUntil = 0;
        this.char.touchingEnemies = new Set();
    }

    /**
    * Sets the character's size and initial position on the screen.
    */
    setSizeAndPosition() {
        this.char.height = 300; // 183 für voidless.dev sprite - 300 * 0.61
        this.char.width = 130; // 158 für voidless.dev sprite - 130 * 1.216
        this.char.x = 1000;
        this.char.y = 370; // 487 für voidless.dev sprite - 370 * 1.9
    }

    /**
    * Sets the character's collision or interaction offset values.
    */
    setOffset() {
        this.char.offset.top = 130;
        this.char.offset.left = 20;
        this.char.offset.right = 40;
        this.char.offset.bottom = 15;
    }

    /**
    * Initializes character image groups.
    */
    initImages() {
        this.initMovementImages();
        this.initEmotionImages();
        this.initActionImages();
        this.initSpecialImages();
    }

    /**
    * Initializes character movement-related image sets.
    */
    initMovementImages() {
        this.char.idleWalkSheet = this.images.idleWalkSheet ?? null;
        this.char.jumpSheet = this.images.jumpSheet ?? null;
    }

    /**
    * Initializes character emotion-related image sets.
    */
    initEmotionImages() {
        this.char.hurtDeadSheet = this.images.hurtDeadSheet ?? null;
        this.char.kneelCryStandUpDeterminedSheet = this.images.kneelCryStandUpDeterminedSheet ?? null;
        this.char.determinedRiseSheet = this.images.determinedRiseSheet ?? null;
        this.char.walkStandDeterminedSheet = this.images.walkStandDeterminedSheet ?? null;
        this.char.walkInStormCollapseSheet = this.images.walkInStormCollapseSheet ?? null;
        this.char.standUpAfterCollapseSheet = this.images.standUpAfterCollapseSheet ?? null;
        this.char.airHitPainStunSheet = this.images.airHitPainStunSheet ?? null;
    }

    /**
    * Initializes character action-related image sets.
    */
    initActionImages() {
        this.char.attackStaffSheet = this.images.attackStaffSheet ?? null;
        this.char.attackSwordSheet = this.images.attackSwordSheet ?? null;
        this.char.jetPackImages = this.images.jetPackImages ?? (this.images.jetPackImages = []);
        this.char.meditationSheet = this.images.meditationSheet ?? null;
        this.char.newWeaponStartSheet = this.images.newWeaponStartSheet ?? null;
        this.char.newWeaponLoopSheet = this.images.newWeaponLoopSheet ?? null;
        this.char.protectSheet = this.images.protectSheet ?? null;
    }

    /**
    * Initializes character special interaction and event-related image sets.
    */
    initSpecialImages() {
        this.char.caressSheet = this.images.caressSheet ?? null;
        this.char.sitDownAndPlayGuitarSheet = this.images.sitDownAndPlayGuitarSheet ?? null;
        this.char.playGuitarAndSingSheet = this.images.playGuitarAndSingSheet ?? null;
        this.char.playGuitarSheet = this.images.playGuitarSheet ?? null;
        this.char.lightCampfireStandUpSheet = this.images.lightCampfireStandUpSheet ?? null;
    }

    /**
    * Initializes character state groups.
    */
    initStates() {
        this.initBasicStates();
        this.initMovementStates();
        this.initActionStates();
        this.initEmotionStates();
        this.initInteractionStates();
    }

    /**
    * Initializes the character's basic state properties.
    */
    initBasicStates() {
        this.char.isFlipped = false;
        this.char.isMoving = false;
        this.char.isGameCharacter = true;
        this.char.throwableBottels = 0;
    }

    /**
    * Initializes the character's movement state flags.
    */
    initMovementStates() {
        this.char.isMovingLeft = false;
        this.char.isMovingRight = false;
        this.char.isWalk = false;
        this.char.isWalkDetermined = false;
        this.char.isWalkInStorm = false;
        this.char.isJumping = false;
        this.char.isLanding = false;
    }

    /**
    * Initializes the character's action state flags.
    */
    initActionStates() {
        this.char.isAttack = false;
        this.char.isStandUp = false;
        this.char.isStandDetermined = false;
        this.char.isNewWeapon = false;
        this.char.isDead = false;
        this.char.isHurt = false;
        this.char.isThrowing = false;
        this.char.isProtect = false;
        this.char.walkOnDestroyedHouse = false;
    }

    /**
    * Initializes the character's emotion state flags.
    */
    initEmotionStates() {
        this.char.isMeditation = false;
        this.char.isKneelAndCry = false;
        this.char.isStandUpAndLookDetermined = false;
        this.char.isLookDeterminedAndStandUp = false;
        this.char.isCollapse = false;
        this.char.isStandUpAfterCollapse = false;
        this.char.isAirHitStun = false;
        this.char.isAirPainStun = false;
    }

    /**
    * Initializes the character's interaction state flags.
    */
    initInteractionStates() {
        this.char.isCaress = false;
        this.char.isSitDownAndPlayGuitar = false;
        this.char.isPlayGuitarAndSing = false;
        this.char.isPlayGuitar = false;
        this.char.isLightACampfire = false;
    }

    /**
    * Initializes combat configuration.
    */
    initCombatConfig() {
        this.char.attackHitbox = this.char.isHaveSword
            ? { top: 200, left: 200, right: 8, bottom: 65, active: false }
            : { top: 220, left: 200, right: 8, bottom: 52, active: false };
    }
}