/**
 * Holds configuration and dependencies for the endboss.
 */
export class EndbossConfig {
    /**
     * Creates a new instance.
     * @param {*} endboss Endboss reference.
     * @param {Object} entityImages Image definitions.
     * @param {Object} allAudios Audio resources.
     * @param {*} world World reference.
     */
    constructor(endboss, entityImages, allAudios, world) {
        this.endboss = endboss;
        this.entityImages = entityImages;
        this.allAudios = allAudios;
        this.world = world;
    }

    /**
     * Initializes all configuration aspects.
     */
    initAll() {
        this.initCoreValues();
        this.setSizeAndPosition();
        this.setOffset();
        this.initBaseImages();
        this.initStates();
    }

    /**
     * Initializes core values and subsystems.
     */
    initCoreValues() {
        this.initEndbossMovement();
        this.initEndbossAudio();
        this.initEndbossAnimation();
        this.initEndbossPhaseEnums();
        this.initEndbossFinisherEnums();
        this.initEndbossAirStateEnums();
        this.initEndbossPhaseState();
        this.initEndbossAirConfig();
    }

    /**
     * Initializes movement-related properties.
     */
    initEndbossMovement() {
        this.endboss.customGroundCheck = () => this.y < -35;
        this.endboss.speedX = 8;
        this.endboss.speedY = 0;
        this.endboss.gravityInterval = 1000 / 60;
        this.endboss.movementSpeed = 5;
    }

    /**
     * Initializes audio management for the endboss.
     */
    initEndbossAudio() {
        this.endboss.audioManager = this.endboss.world.audioManager;
        const audioManager = this.endboss.audioManager;
        this.endboss.fadeOutAudio = audioManager.fadeOutAudio.bind(audioManager);
        this.endboss.fadeInAudio = audioManager.fadeInAudio.bind(audioManager);
    }

    /**
     * Initializes animation-related properties.
     */
    initEndbossAnimation() {
        this.endboss.currentAnimation = 'idle';
        this.endboss.frameInterval = 1000 / 8;
        this.endboss.frameIndex = 0;
        this.endboss.sheetIndex = 0;
        this.endboss.lastFrameTime = 0;
        this.endboss.animationFinished = false;
        this.endboss.frameSource = null;
    }

    /**
     * Initializes phase enumeration values.
     */
    initEndbossPhaseEnums() {
        this.endboss.ENDBOSS_PHASE = {
            INTRO: 0,
            AIR_EGGS: 1,
            STORM: 2,
            GROUND: 3,
            ENRAGE: 4,
            DEAD: 99
        };
    }

    /**
     * Initializes finisher enumeration values.
     */
    initEndbossFinisherEnums() {
        this.endboss.FINISHER = {
            TAKEOFF: 0,
            DROP_TORNADO_EGG: 1,
            WAIT_TORNADO_DONE: 2,
            MOVE_TO_FIRE_POS: 3,
            BOSS_DESCEND: 4,
            FIRE_BREATH: 5,
            DONE: 99
        };
    }

    /**
     * Initializes air state enumeration values.
     */
    initEndbossAirStateEnums() {
        this.endboss.AIR_STATE = {
            MOVE: 0,
            DROP: 1,
            WAIT: 2,
            DESCEND: 3,
            ASCEND: 4
        };
    }

    /**
     * Initializes phase-related state values.
     */
    initEndbossPhaseState() {
        this.endboss.phase = this.endboss.ENDBOSS_PHASE.INTRO;
        this.endboss.phaseStartTime = performance.now();
        this.endboss.isVulnerable = false;
        this.endboss.airState = this.endboss.AIR_STATE.MOVE;
        this.endboss.airTargetX = null;
        this.endboss.airDropIndex = 0;
        this.endboss.airLastActionTime = 0;
    }

    /**
     * Initializes air movement configuration.
     */
    initEndbossAirConfig() {
        this.endboss.airPoints = [
            27000,
            27800,
            28200
        ];
        this.endboss.airPointIndex = 0;
        this.endboss.airDropSequence = [
            { type: 'small', delay: 0 },
            { type: 'big', delay: 2000 }
        ];
    }

    /**
     * Sets size and initial position.
     */
    setSizeAndPosition() {
        this.endboss.x = 26000;
        this.endboss.y = -100;
        this.endboss.width = 350;
        this.endboss.height = 500;
    }

    /**
     * Sets collision offset values.
     */
    setOffset() {
        this.endboss.offset.top = 98;
        this.endboss.offset.left = 75;
        this.endboss.offset.right = 80;
        this.endboss.offset.bottom = 35;
    }

    /**
     * Initializes base image resources.
     */
    initBaseImages() {
        this.endboss.idleImages = this.entityImages.endboss?.idle ?? [];
        this.endboss.walkImages = this.entityImages.endboss?.walk ?? [];
        this.endboss.deadImages = this.entityImages.endboss?.dead ?? [];
        this.endboss.hurtImages = this.entityImages.endboss?.hurt ?? [];
        this.endboss.flyImages = this.entityImages.endboss?.fly ?? [];
        this.endboss.findsPeaceImages = this.entityImages.endboss?.findsPeace ?? [];
        this.endboss.fireballAttackImages = this.entityImages.endboss?.fireballAttack ?? [];
        this.endboss.fireBreathAttackImages = this.entityImages.endboss?.fireBreathAttack ?? [];
        this.endboss.jumpImages = this.entityImages.endboss?.jump ?? [];
        this.endboss.rageImages = this.entityImages.endboss?.rage ?? null;
    }

    /**
     * Initializes state-related configurations.
     */
    initStates() {
        this.initCoreFlags();
        this.initAirMovementState();
        this.initAirAttackState();
        this.initGroundFireballState();
        this.initFinisherState();
        this.initFinisherFireState();
        this.initFireBreathState();
    }

    /**
     * Initializes core state flags.
     */
    initCoreFlags() {
        this.endboss.isHurt = false;
        this.endboss.isDead = false;
        this.endboss.isDeadAnimationReady = false;
        this.endboss.isMovingLeft = false;
        this.endboss.isMovingRight = false;
        this.endboss.isJumping = false;
        this.endboss.isUnderTheGround = false;
        this.endboss.isFindsPeace = false;
        this.endboss.isFly = false;
        this.endboss.isRage = false;
        this.endboss.isFireballAttack = false;
    }

    /**
     * Initializes air movement state values.
     */
    initAirMovementState() {
        this.endboss.airMinX = 22650;
        this.endboss.airMaxX = 23350;
        this.endboss.airY = -100;
        this.endboss.airSpeed = 220;
        this.endboss.airDir = 1;
        this.endboss.airBobAmp = 8;
        this.endboss.airBobSpeed = 0.006;
        this.endboss.lastAirTime = null;
    }

    /**
     * Initializes air attack state values.
     */
    initAirAttackState() {
        this.endboss.attackOnCooldown = false;
        this.endboss.hasFiredThisAttack = false;
        this.endboss.fireballCooldown = 2000;
        this.endboss.lastFireballAttackTime = 0;
    }

    /**
     * Initializes ground fireball state values.
     */
    initGroundFireballState() {
        this.endboss.groundFireballShotsDone = 0;
        this.endboss.groundFireballShotsMax = 5;
        this.endboss.groundFireballSequenceActive = false;
        this.endboss.groundSequenceShotDelay = 600;
        this.endboss.lastSequenceShotTime = 0;
        this.endboss.groundShotInProgress = false;
    }

    /**
     * Initializes finisher state values.
     */
    initFinisherState() {
        this.endboss.lowEnergyThreshold = 90;
        this.endboss.finisherStarted = false;
        this.endboss.finisherState = 0;
        this.endboss.finisherStartTime = 0;
    }

    /**
     * Initializes finisher fire state values.
     */
    initFinisherFireState() {
        this.endboss.finisherFireX = 27800;
        this.endboss.finisherFireShotsMax = 5;
        this.endboss.finisherFireShotsDone = 0;
        this.endboss.finisherFireShotDelay = 450;
        this.endboss.lastFinisherShotTime = 0;
    }

    /**
     * Initializes fire breath state values.
     */
    initFireBreathState() {
        this.endboss.isFireBreath = false;
        this.endboss.fireBreathBeam = null;
        this.endboss.fireBreathDamage = 1;
        this.endboss.fireBreathTickMs = 180;
        this.endboss.lastBreathDamageTime = 0;
    }
}