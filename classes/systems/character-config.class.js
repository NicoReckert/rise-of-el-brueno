export class CharacterConfig {

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
    }

    initCoreValues() {
        this.char.speedX = 8;
        this.char.movementSpeed;
        this.char.lastFrameTime = 0;
        this.char.currentAnimation = 'idle';
        this.char.frameInterval = 1000 / 2.5;
        this.char.frameIndex = 0;
        this.char.level_start_x = 440;
        this.char.yNormal = 370;
        this.char.yVoidless = 487;
        this.char.sheetIndex = 0;
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

    initCombatConfig() {
        this.char.attackHitbox = this.c.isHaveSword
            ? { top: 200, left: 200, right: 8, bottom: 65, active: false }
            : { top: 220, left: 200, right: 8, bottom: 52, active: false };
    }
}