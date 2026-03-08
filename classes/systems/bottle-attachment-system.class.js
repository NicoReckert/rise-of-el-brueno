/**
 * System that manages bottle attachment and pose updates during throw animations.
 */
export class BottleAttachmentSystem {
    /**
     * Creates a new bottle attachment system instance.
     * @param {Object} options Constructor options.
     * @param {*} options.world World reference.
     * @param {string} [options.animName='throw'] Animation name.
     * @param {number} [options.releaseFrame=4] Frame index where the bottle is released.
     * @param {number} [options.bottleW=80] Bottle width.
     * @param {number} [options.bottleH=100] Bottle height.
     * @param {number} [options.gripAx=18] Grip anchor X offset.
     * @param {number} [options.gripAy=70] Grip anchor Y offset.
     * @param {Array<Object>|null} [options.handKF=null] Optional hand keyframes.
     */
    constructor({ world, animName = 'throw', releaseFrame = 4, bottleW = 80, bottleH = 100, gripAx = 18, gripAy = 70, handKF = null }) {
        this.world = world;
        this.animName = animName;
        this.releaseFrame = releaseFrame;
        this.gripAx = gripAx;
        this.gripAy = gripAy;
        this.initHandKF(handKF);
        this.initHeldBottle(bottleW, bottleH, gripAx, gripAy);
    }

    /**
     * Updates the bottle attachment state.
     * @returns {void}
     */
    update() {
        this.ensureHandSheet();
        this.updateHeldBottlePose();
    }

    /**
     * Initializes hand keyframes.
     * @param {Array<Object>} [handKF] Optional hand keyframe configuration.
     * @returns {void}
     */
    initHandKF(handKF) {
        this.handKF = handKF ?? [
            { x: 0, y: 50, show: true },
            { x: -5, y: 50, show: true },
            { x: 0, y: 50, show: true },
            { x: 75, y: 25, show: true },
            { x: 0, y: 0, show: false },
            { x: 0, y: 0, show: false }
        ];
    }

    /**
     * Initializes the held bottle configuration.
     * @param {number} bottleW Bottle width.
     * @param {number} bottleH Bottle height.
     * @param {number} gripAx Grip anchor X offset.
     * @param {number} gripAy Grip anchor Y offset.
     * @returns {void}
     */
    initHeldBottle(bottleW, bottleH, gripAx, gripAy) {
        this.heldBottle = {
            localX: 0,
            localY: 0,
            width: bottleW,
            height: bottleH,
            visible: false,
            sheet: null,
            frameSource: null,
            gripAx,
            gripAy,
            draw: (ctx) => this.drawHeldBottle(ctx)
        };
    }

    /**
     * Draws the held bottle if visible.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @returns {void}
     */
    drawHeldBottle(ctx) {
        if (!this.heldBottle.visible) return;
        const parts = this.getHeldBottleParts();
        if (!parts) return;
        const { char, dx, dy, fx, image, fs } = parts;
        ctx.save();
        if (char.isFlipped) {
            this.drawHeldBottleFlipped(ctx, char, dx, dy, fx, image, fs);
        } else {
            this.drawHeldBottleNormal(ctx, char, dx, dy, image, fs);
        }
        ctx.restore();
    }

    /**
     * Returns required parts for drawing the held bottle.
     * @returns {Object|null} Drawing parts or null if unavailable.
     */
    getHeldBottleParts() {
        const char = this.world.character;
        const sheet = this.heldBottle.sheet;
        const meta = sheet?.meta;
        if (!char || !meta) return null;
        const image = sheet.image ?? sheet.img ?? sheet;
        const fs = this.heldBottle.frameSource;
        const d = char.drawOffset || { x: 0, y: 0, flipX: 0 };
        return { char, image, fs, dx: d.x || 0, dy: d.y || 0, fx: d.flipX || 0 };
    }

    /**
     * Draws the held bottle when the character is flipped.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} char Character instance.
     * @param {number} dx Draw offset X.
     * @param {number} dy Draw offset Y.
     * @param {number} fx Flip offset X.
     * @param {HTMLImageElement|Object} image Image source.
     * @param {Object} fs Frame source data.
     * @returns {void}
     */
    drawHeldBottleFlipped(ctx, char, dx, dy, fx, image, fs) {
        const tx = Math.round(char.x + char.width + dx + fx);
        const ty = Math.round(char.y + dy);
        ctx.translate(tx, ty);
        ctx.scale(-1, 1);
        const x = this.heldBottle.localX;
        const y = this.heldBottle.localY;
        this.drawHeldBottleImage(ctx, image, fs, x, y);
    }

    /**
     * Draws the held bottle when the character is not flipped.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {Object} char Character instance.
     * @param {number} dx Draw offset X.
     * @param {number} dy Draw offset Y.
     * @param {HTMLImageElement|Object} image Image source.
     * @param {Object} fs Frame source data.
     * @returns {void}
     */
    drawHeldBottleNormal(ctx, char, dx, dy, image, fs) {
        const x = Math.round(char.x + dx + this.heldBottle.localX);
        const y = Math.round(char.y + dy + this.heldBottle.localY);
        this.drawHeldBottleImage(ctx, image, fs, x, y);
    }

    /**
     * Draws the held bottle image.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     * @param {HTMLImageElement|Object} image Image source.
     * @param {Object} [fs] Frame source data.
     * @param {number} x Target X position.
     * @param {number} y Target Y position.
     * @returns {void}
     */
    drawHeldBottleImage(ctx, image, fs, x, y) {
        const { width, height, gripAx, gripAy } = this.heldBottle;
        const px = x - gripAx;
        const py = y - gripAy;
        if (fs) return ctx.drawImage(image, fs.sx, fs.sy, fs.sw, fs.sh, px, py, width, height);
        ctx.drawImage(image, px, py, width, height);
    }

    /**
     * Ensures the hand sheet for the held bottle is available.
     * @returns {void}
     */
    ensureHandSheet() {
        if (this.heldBottle.sheet?.meta) return;
        this.heldBottle.sheet = this.world.entityImages?.throwableBottle?.hand ?? null;
    }

    /**
     * Returns the visible character frame index.
     * @param {Object} char Character instance.
     * @returns {number} Visible frame index.
     */
    getVisibleCharFrame(char) {
        return Math.max(0, (char?.frameIndex ?? 0) - 1);
    }

    /**
     * Updates the held bottle pose based on the current character frame.
     * @returns {void}
     */
    updateHeldBottlePose() {
        const char = this.world.character;
        this.heldBottle.visible = false;
        if (!this.canUpdateHeldBottlePose(char)) return;
        const meta = this.heldBottle.sheet.meta;
        const cf = this.getVisibleCharFrame(char);
        if (!this.isValidHeldBottleFrame(cf)) return;
        const kf = this.getHeldBottleKeyframe(cf);
        if (!kf?.show) return;
        this.setHeldBottleFrameSource(cf, meta);
        this.setHeldBottlePose(kf);
    }

    /**
     * Checks whether the held bottle pose can be updated.
     * @param {Object} char Character instance.
     * @returns {boolean} True if the pose can be updated, otherwise false.
     */
    canUpdateHeldBottlePose(char) {
        if (!char?.isThrowing) return false;
        if (char.currentAnimation !== this.animName) return false;
        return !!this.heldBottle.sheet?.meta;
    }

    /**
     * Checks whether the frame index is valid for the held bottle.
     * @param {number} cf Character frame index.
     * @returns {boolean} True if the frame is valid, otherwise false.
     */
    isValidHeldBottleFrame(cf) {
        if (cf <= 0) return false;
        if (cf >= this.releaseFrame) return false;
        return true;
    }

    /**
     * Returns the held bottle keyframe for the given frame.
     * @param {number} cf Character frame index.
     * @returns {Object|undefined} Keyframe data.
     */
    getHeldBottleKeyframe(cf) {
        const index = Math.min(cf, this.handKF.length - 1);
        return this.handKF[index];
    }

    /**
     * Sets the frame source for the held bottle based on the character frame.
     * @param {number} cf Character frame index.
     * @param {Object} meta Sprite sheet metadata.
     * @returns {void}
     */
    setHeldBottleFrameSource(cf, meta) {
        const handFrame = Math.min(cf, 3);
        const col = handFrame % meta.columns;
        const row = Math.floor(handFrame / meta.columns);
        this.heldBottle.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
    }

    /**
     * Sets the held bottle pose.
     * @param {Object} kf Keyframe data.
     * @returns {void}
     */
    setHeldBottlePose(kf) {
        this.heldBottle.localX = kf.x;
        this.heldBottle.localY = kf.y;
        this.heldBottle.visible = true;
    }

    /**
     * Sets the hand keyframes.
     * @param {Array<Object>} kfArray Keyframe array.
     * @returns {void}
     */
    setKeyframes(kfArray) {
        if (Array.isArray(kfArray) && kfArray.length) this.handKF = kfArray;
    }

    /**
     * Returns spawn data for the thrown bottle.
     * @param {Object} char Character instance.
     * @returns {{sx: number, sy: number, kf: Object}} Spawn position and keyframe data.
     */
    getSpawnData(char) {
        const spawnKfIndex = Math.max(0, this.releaseFrame - 1);
        const kfIndex = Math.min(spawnKfIndex, this.handKF.length - 1);
        const kf = this.handKF[kfIndex] ?? this.handKF[0];
        const d = char.drawOffset || { x: 0, y: 0, flipX: 0 };
        const dx = d.x || 0;
        const dy = d.y || 0;
        const fx = d.flipX || 0;
        const sx = char.isFlipped ? char.x + char.width + dx + fx - kf.x : char.x + dx + kf.x;
        const sy = char.y + dy + kf.y;
        return { sx, sy, kf };
    }
}