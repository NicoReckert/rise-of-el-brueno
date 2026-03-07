/**
 * Configuration wrapper for an endboss tornado.
 */
export class EndbossTornadoConfig {
    /**
     * Creates a new instance.
     * @param {*} endbossTornado Tornado reference.
     * @param {*} entityImages Image resources.
     */
    constructor(endbossTornado, entityImages) {
        this.tornado = endbossTornado;
        this.entityImages = entityImages;
    }

    /**
     * Initializes all properties.
     * @param {number} x Initial x position.
     * @param {number} y Initial y position.
     */
    initAll(x, y) {
        this.initTimeState();
        this.initPosition(x, y);
        this.initMovement();
        this.initState();
        this.initAnimation();
        this.initAppearance();
    }

    /**
     * Initializes time state.
     */
    initTimeState() {
        this.tornado.lastUpdateTime = 0;
        this.tornado.deltaTime = 0;
    }

    /**
     * Initializes position.
     * @param {number} x Initial x position.
     * @param {number} y Initial y position.
     */
    initPosition(x, y) {
        this.tornado.x = x;
        this.tornado.y = y;
        this.tornado.groundY = y;
        this.tornado.buildX = x;
        this.tornado.buildYHero = 135;
    }

    /**
     * Initializes movement properties.
     */
    initMovement() {
        this.tornado.width = 360;
        this.tornado.height = 460;
        this.tornado.speed = 10;
        this.tornado.liftSpeed = 2.2;
        this.tornado.wiggleStart = 0;
        this.tornado.wiggleDuration = 1200;
        this.tornado.wiggleAmp = 25;
    }

    /**
     * Initializes state properties.
     */
    initState() {
        this.tornado.state = "SEEK";
        this.tornado.target = null;
        this.tornado.captured = false;
        this.tornado.isFinished = false;
    }

    /**
     * Initializes animation properties.
     */
    initAnimation() {
        this.tornado.frameIndex = 0;
        this.tornado.sheetIndex = 0;
        this.tornado.lastFrameTime = 0;
        this.tornado.frameInterval = 1000 / 10;
        this.tornado.anim = this.entityImages.endboss?.tornadoAttack || null;
    }

    /**
     * Initializes appearance properties.
     */
    initAppearance() {
        this.tornado.releaseStart = 0;
        this.tornado.releaseDuration = 600;
        this.tornado.opacity = 1;
    }
}