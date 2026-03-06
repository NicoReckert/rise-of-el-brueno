export class EnemyConfig {
    constructor() {
        this.lastFrameTime = 0;
        this.sheetIndex = 0;
        this.animationFinished = false;
        this.frameInterval = 1000 / 8;
        this.frameIndex = 0;
        this.isMovingLeft = true;
        this.isDead = false;
        this.isHurt = false;
        this.isAttack = false;
        this.health = 3;
        this.speedX = 0.6;
        this.knockbackActive = false;
        this.acceleration = 1.5;
        this.spawnY = (this.currentEnemy === 'dragonSmall') ? 200 : y;
        this.attackOnCooldown = false;
        this.attackCooldownMs = 900;
        this.lastAttackTime = 0;
        this.meleeRange = 64
        this.rangedRange = 320;
        this.hurtUntil = 0;
        this.removeAt = 0;
        this.isRemoved = false;
        this.knockFriction = 0.85;
        this.knockStopThreshold = 0.5;
        this.hasHitPlayerThisAttack = false;


        this.attackHitbox = currentEnemy !== 'dragonSmall'
            ? {
                top: 45,
                left: 20,
                right: 120,
                bottom: 45,
                active: false
            }
            :
            this.attackHitbox = {
                top: 68,
                left: 5,
                right: 135,
                bottom: 52,
                active: false
            };



        //dragon
        this.airState = 'idle';
        this.attackDistance = 220;
        this.approachDistance = 500;
        this.retreatHeight = 140;
        this.flySpeed = 60;
        this.diveSpeed = 180;
        this.diveStartTime = 0;
        this.diveStartDuration = 250;
        this.diveUpAngle = null;
        this.exitDir = 1;
        this.lockDirection = false;
        this.approachBaseY = null;
        this.planeY = null;
        this.preDiveX = null;
        this.postDiveX = null;
        this.hasAttackedThisDive = false;
        this.lowApproachSpeed = this.flySpeed * 2.5;
        this.deathPhase = null;
        this.deathFallSpeed = 350;
        this.deathGroundY = 525;
        this.hasBeenHitThisDive = false;

    }


    /**
     * Initializes image sets, size, and offset configuration.
     */
    init(currentEnemy) {
        this.idle = this.entityImages[currentEnemy]?.idle ?? [];
        this.walk = this.entityImages[currentEnemy]?.walk ?? [];
        this.hurt = this.entityImages[currentEnemy]?.hurt ?? [];
        this.dead = this.entityImages[currentEnemy]?.dead ?? [];
        this.attack = this.entityImages[currentEnemy]?.attack ?? [];
        this.airApproach = this.entityImages[currentEnemy]?.airApproach ?? [];
        this.diveStart = this.entityImages[currentEnemy]?.diveStart ?? [];
        this.diveFast = this.entityImages[currentEnemy]?.diveFast ?? [];
        this.diveUpShallow = this.entityImages[currentEnemy]?.diveUpShallow ?? [];
        this.diveUpMedium = this.entityImages[currentEnemy]?.diveUpMedium ?? [];
        this.diveUpSteep = this.entityImages[currentEnemy]?.diveUpSteep ?? [];
        this.fallDown = this.entityImages[currentEnemy]?.fallDown ?? [];
        this.impact = this.entityImages[currentEnemy]?.impact ?? [];
        if (this.x == null) this.setSizeAndPosition();
        this.setOffset();
    }

    /**
     * Sets the object's initial size and random position.
     */
    setSizeAndPosition() {
        this.x = 12000 + Math.random() * 2000; // 600
        // this.y = 545;
        // this.height = 120;
        // this.width = 120;
    }

    /**
     * Sets collision or interaction offset values.
     */
    setOffset() {
        if (this.currentEnemy === 'chickenMutatesSmall') {
            this.offset.top = 25;
            this.offset.left = 25;
            this.offset.right = 35;
            this.offset.bottom = 10;
        } else if (this.currentEnemy === 'chickenMutatesBig') {
            this.offset.top = 35;
            this.offset.left = 20;
            this.offset.right = 60;
            this.offset.bottom = 10;
        } else {
            this.offset.top = 60;
            this.offset.left = 10;
            this.offset.right = 10;
            this.offset.bottom = 45;
        }
    }
}