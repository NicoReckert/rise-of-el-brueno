/**
 * Configuration object for an enemy instance.
 */
export class EnemyConfig {
    /**
     * Creates a new instance.
     * @param {object} enemy Enemy instance.
     * @param {string} currentEnemy Enemy identifier.
     * @param {object} entityImages Image collection.
     * @param {number} [width=120] Enemy width.
     * @param {number} [height=120] Enemy height.
     * @param {?number} [x=null] Horizontal position.
     * @param {number} [y=545] Vertical position.
     * @param {object} allAudios Audio collection.
     * @param {object} world World reference.
     */
    constructor(enemy, currentEnemy, entityImages, width = 120, height = 120, x = null, y = 545, allAudios, world) {
        this.enemy = enemy;
        this.currentEnemy = currentEnemy;
        this.entityImages = entityImages;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.allAudios = allAudios;
        this.world = world;
    }

    /**
     * Initializes all enemy configuration state.
     * @returns {void}
     */
    initAll() {
        this.initBaseReferences();
        this.initDimensions();
        this.initAnimationState();
        this.initCoreState();
        this.initMovementState();
        this.initCombatState();
        this.initDragonState();
        this.initAttackHitbox();
        this.initImages();
        if (this.enemy.x == null) this.setSizeAndPosition();
        this.setOffset();
    }

    /**
     * Initializes enemy dimensions and position.
     * @returns {void}
     */
    initDimensions() {
        this.enemy.width = this.width;
        this.enemy.height = this.height;
        this.enemy.x = this.x;
        this.enemy.spawnY = this.currentEnemy === 'dragonSmall' ? 200 : this.y;
        this.enemy.y = this.enemy.spawnY;
    }

    /**
     * Initializes base enemy references.
     * @returns {void}
     */
    initBaseReferences() {
        this.enemy.world = this.world;
        this.enemy.currentEnemy = this.currentEnemy;
        this.enemy.entityImages = this.entityImages;
        this.enemy.allAudios = this.allAudios;
    }

    /**
     * Initializes enemy animation state.
     * @returns {void}
     */
    initAnimationState() {
        this.enemy.animCtrl.setAnimation('walk');
        this.enemy.lastFrameTime = 0;
        this.enemy.sheetIndex = 0;
        this.enemy.animationFinished = false;
        this.enemy.frameInterval = 1000 / 8;
        this.enemy.frameIndex = 0;
    }

    /**
     * Initializes core enemy state.
     * @returns {void}
     */
    initCoreState() {
        this.enemy.isMovingLeft = true;
        this.enemy.isDead = false;
        this.enemy.isHurt = false;
        this.enemy.isAttack = false;
        this.enemy.hurtUntil = 0;
        this.enemy.removeAt = 0;
        this.enemy.isRemoved = false;
    }

    /**
     * Initializes combat state.
     * @returns {void}
     */
    initCombatState() {
        this.enemy.health = 3;
        this.enemy.attackOnCooldown = false;
        this.enemy.attackCooldownMs = 900;
        this.enemy.lastAttackTime = 0;
        this.enemy.meleeRange = 64;
        this.enemy.rangedRange = 320;
        this.enemy.hasHitPlayerThisAttack = false;
        this.enemy.hasFiredThisAttack = false;
    }

    /**
     * Initializes movement state.
     * @returns {void}
     */
    initMovementState() {
        this.enemy.movementSpeed = 0;
        this.enemy.lastUpdateTime = 0;
        this.enemy.speedX = 0.6;
        this.enemy.acceleration = 1.5;
        this.enemy.knockbackActive = false;
        this.enemy.knockFriction = 0.85;
        this.enemy.knockStopThreshold = 0.5;
    }

    /**
     * Initializes dragon-specific state.
     * @returns {void}
     */
    initDragonState() {
        this.initDragonMovementConfig();
        this.initDragonDiveState();
        this.initDragonFlightPlaneState();
        this.initDragonAttackFlags();
        this.initDragonDeathState();
    }

    /**
     * Initializes dragon movement configuration.
     * @returns {void}
     */
    initDragonMovementConfig() {
        this.enemy.airState = 'idle';
        this.enemy.attackDistance = 220;
        this.enemy.approachDistance = 500;
        this.enemy.retreatHeight = 140;
        this.enemy.flySpeed = 60;
    }

    /**
     * Initializes dragon dive state.
     * @returns {void}
     */
    initDragonDiveState() {
        this.enemy.diveSpeed = 180;
        this.enemy.diveStartTime = 0;
        this.enemy.diveStartDuration = 250;
        this.enemy.diveUpAngle = null;
        this.enemy.exitDir = 1;
        this.enemy.lockDirection = false;
    }

    /**
     * Initializes dragon flight plane state.
     * @returns {void}
     */
    initDragonFlightPlaneState() {
        this.enemy.approachBaseY = null;
        this.enemy.planeY = null;
        this.enemy.preDiveX = null;
        this.enemy.postDiveX = null;
    }

    /**
     * Initializes dragon attack flags.
     * @returns {void}
     */
    initDragonAttackFlags() {
        this.enemy.hasAttackedThisDive = false;
        this.enemy.lowApproachSpeed = this.enemy.flySpeed * 2.5;
        this.enemy.hasBeenHitThisDive = false;
    }

    /**
     * Initializes dragon death state.
     * @returns {void}
     */
    initDragonDeathState() {
        this.enemy.deathPhase = null;
        this.enemy.deathFallSpeed = 350;
        this.enemy.deathGroundY = 525;
    }

    /**
     * Initializes the attack hitbox.
     * @returns {void}
     */
    initAttackHitbox() {
        this.enemy.attackHitbox = this.getAttackHitboxConfig();
    }

    /**
     * Returns the attack hitbox configuration.
     * @returns {object} Attack hitbox configuration.
     */
    getAttackHitboxConfig() {
        const isSmallDragon = this.currentEnemy === "dragonSmall";
        if (isSmallDragon) {
            return this.getSmallDragonHitbox();
        }
        return this.getDefaultHitbox();
    }

    /**
     * Returns the default attack hitbox configuration.
     * @returns {object} Default attack hitbox configuration.
     */
    getDefaultHitbox() {
        return {
            top: 45,
            left: 20,
            right: 120,
            bottom: 45,
            active: false
        };
    }

    /**
     * Returns the small dragon attack hitbox configuration.
     * @returns {object} Small dragon attack hitbox configuration.
     */
    getSmallDragonHitbox() {
        return {
            top: 68,
            left: 5,
            right: 135,
            bottom: 52,
            active: false
        };
    }

    /**
     * Initializes enemy image sources.
     * @returns {void}
     */
    initImages() {
        const src = this.entityImages[this.currentEnemy] ?? {};
        this.initBaseImages(src);
        this.initDiveImages(src);
        this.initDeathImages(src);
    }

    /**
     * Initializes base enemy image sets.
     * @param {object} src Image source collection.
     * @returns {void}
     */
    initBaseImages(src) {
        this.enemy.idle = src.idle ?? [];
        this.enemy.walk = src.walk ?? [];
        this.enemy.hurt = src.hurt ?? [];
        this.enemy.dead = src.dead ?? [];
        this.enemy.attack = src.attack ?? [];
        this.enemy.airApproach = src.airApproach ?? [];
    }

    /**
     * Initializes dive-related image sets.
     * @param {object} src Image source collection.
     * @returns {void}
     */
    initDiveImages(src) {
        this.enemy.diveStart = src.diveStart ?? [];
        this.enemy.diveFast = src.diveFast ?? [];
        this.enemy.diveUpShallow = src.diveUpShallow ?? [];
        this.enemy.diveUpMedium = src.diveUpMedium ?? [];
        this.enemy.diveUpSteep = src.diveUpSteep ?? [];
    }

    /**
     * Initializes death-related image sets.
     * @param {object} src Image source collection.
     * @returns {void}
     */
    initDeathImages(src) {
        this.enemy.fallDown = src.fallDown ?? [];
        this.enemy.impact = src.impact ?? [];
    }

    /**
     * Sets the enemy size and initial position.
     * @returns {void}
     */
    setSizeAndPosition() {
        this.enemy.x = 12000 + Math.random() * 2000;
    }

    /**
     * Sets the collision offset configuration.
     * @returns {void}
     */
    setOffset() {
        const offsetConfig = this.getOffsetConfig();
        this.applyOffset(offsetConfig);
    }

    /**
     * Returns the collision offset configuration.
     * @returns {object} Collision offset configuration.
     */
    getOffsetConfig() {
        if (this.currentEnemy === "chickenMutatesSmall") {
            return { top: 25, left: 25, right: 35, bottom: 10 };
        }
        if (this.currentEnemy === "chickenMutatesBig") {
            return { top: 35, left: 20, right: 60, bottom: 10 };
        }
        return { top: 60, left: 10, right: 10, bottom: 45 };
    }

    /**
     * Applies the collision offset configuration.
     * @param {object} offsetConfig Collision offset configuration.
     * @returns {void}
     */
    applyOffset(offsetConfig) {
        this.enemy.offset.top = offsetConfig.top;
        this.enemy.offset.left = offsetConfig.left;
        this.enemy.offset.right = offsetConfig.right;
        this.enemy.offset.bottom = offsetConfig.bottom;
    }
}