/**
 * Renders the game world.
 */
export class WorldRenderer {
    /**
    * Creates a new instance.
    * @param {*} ctx Rendering context.
    */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
    * Adds multiple objects to the world.
    * @param {Array} objectArray List of objects.
    */
    addObject(objectArray) {
        objectArray.forEach(obj => this.addToWorld(obj));
    }

    /**
    * Adds a drawable object to the world.
    * @param {*} object Object to draw.
    * @param {CanvasRenderingContext2D} [ctx=this.ctx] Rendering context.
    */
    addToWorld(object, ctx = this.ctx) {
        if (!this.isDrawableObject(object)) return;
        const flipState = this.getFlipState(object);
        const offsets = this.getObjectOffsets(object);
        const drawOffsets = this.getDrawOffsets(object);
        ctx.save();
        this.applyObjectOpacity(ctx, object);
        this.drawObjectWithFlip(ctx, object, flipState, offsets, drawOffsets);
        ctx.restore();
    }

    /**
    * Checks whether an object is drawable.
    * @param {*} object Object to check.
    * @returns {boolean} True if drawable, otherwise false.
    */
    isDrawableObject(object) {
        if (!object) return false;
        if (!object.img) return false;
        return true;
    }

    /**
    * Determines whether an object should be flipped.
    * @param {*} object Object to evaluate.
    * @returns {boolean} True if the object should be flipped, otherwise false.
    */
    getFlipState(object) {
        const flipped = !!(object.isFlipped ?? false);
        const npcFlipped = !!(object.isNpcFlipped ?? false);
        return flipped || npcFlipped;
    }

    /**
    * Returns the object offsets.
    * @param {*} object Object containing offset data.
    * @returns {{left: number, right: number, top: number, bottom: number}} Offset values.
    */
    getObjectOffsets(object) {
        const baseOffsets = { left: 0, right: 0, top: 0, bottom: 0 };
        return Object.assign(baseOffsets, object.offset || {});
    }

    /**
    * Returns the drawing offsets of an object.
    * @param {*} object Object containing draw offset data.
    * @returns {{x: number, y: number, flipX: number}} Drawing offset values.
    */
    getDrawOffsets(object) {
        const baseOffsets = { x: 0, y: 0, flipX: 0 };
        return Object.assign(baseOffsets, object.drawOffset || {});
    }

    /**
    * Applies the object's opacity to the rendering context.
    * @param {*} ctx Rendering context.
    * @param {*} object Object containing opacity data.
    */
    applyObjectOpacity(ctx, object) {
        if (object.opacity !== undefined) {
            ctx.globalAlpha = object.opacity;
            return;
        }
        ctx.globalAlpha = 1;
    }

    /**
    * Draws an object with optional horizontal flip.
    * @param {*} ctx Rendering context.
    * @param {*} object Object to draw.
    * @param {boolean} isFlipped Whether the object should be flipped.
    * @param {{left: number, right: number, top: number, bottom: number}} offsets Object offsets.
    * @param {{x: number, y: number, flipX: number}} drawOffsets Drawing offsets.
    */
    drawObjectWithFlip(ctx, object, isFlipped, offsets, drawOffsets) {
        const dx = drawOffsets.x;
        const dy = drawOffsets.y;
        const fx = drawOffsets.flipX;
        if (isFlipped) {
            this.drawFlippedObject(ctx, object, offsets, dx, dy, fx);
            return;
        }
        this.drawRegularObject(ctx, object, offsets, dx, dy);
    }

    /**
    * Draws a horizontally flipped object.
    * @param {*} ctx Rendering context.
    * @param {*} object Object to draw.
    * @param {{left: number, right: number, top: number, bottom: number}} offsets Object offsets.
    * @param {number} dx Horizontal draw offset.
    * @param {number} dy Vertical draw offset.
    * @param {number} fx Additional horizontal flip offset.
    */
    drawFlippedObject(ctx, object, offsets, dx, dy, fx) {
        const tx = Math.round(object.x + object.width + dx + fx);
        const ty = Math.round(object.y + dy);
        ctx.translate(tx, ty);
        ctx.scale(-1, 1);
        this.drawSprite(ctx, object, 0, 0);
        if (!object.isGamecharacter) return;
        this.drawCharacterDebugFlipped(ctx, object, offsets);
    }

    /**
    * Draws a non-flipped object.
    * @param {*} ctx Rendering context.
    * @param {*} object Object to draw.
    * @param {{left: number, right: number, top: number, bottom: number}} offsets Object offsets.
    * @param {number} dx Horizontal draw offset.
    * @param {number} dy Vertical draw offset.
    */
    drawRegularObject(ctx, object, offsets, dx, dy) {
        const drawX = Math.round(object.x + dx);
        const drawY = Math.round(object.y + dy);
        this.drawSprite(ctx, object, drawX, drawY);
        if (!object.isGamecharacter) return;
        this.drawCharacterDebug(ctx, object, offsets, drawX, drawY);
    }

    /**
    * Draws a sprite.
    * @param {*} ctx Rendering context.
    * @param {{img: *, width: number, height: number, frameSource?: *}} object Sprite data.
    * @param {number} dx Horizontal draw position.
    * @param {number} dy Vertical draw position.
    */
    drawSprite(ctx, object, dx, dy) {
        const { img, width, height, frameSource } = object;
        if (frameSource) {
            this.drawSpriteFrame(ctx, img, frameSource, dx, dy, width, height);
            return;
        }
        this.drawFullSprite(ctx, img, dx, dy, width, height);
    }

    /**
    * Draws a sprite frame from a source image.
    * @param {*} ctx Rendering context.
    * @param {*} img Source image.
    * @param {{sx: number, sy: number, sw: number, sh: number}} frame Frame source data.
    * @param {number} dx Horizontal draw position.
    * @param {number} dy Vertical draw position.
    * @param {number} width Target width.
    * @param {number} height Target height.
    */
    drawSpriteFrame(ctx, img, frame, dx, dy, width, height) {
        ctx.drawImage(
            img,
            frame.sx,
            frame.sy,
            frame.sw,
            frame.sh,
            dx,
            dy,
            width,
            height
        );
    }

    /**
    * Draws a full image sprite.
    * @param {*} ctx Rendering context.
    * @param {*} img Source image.
    * @param {number} dx Horizontal draw position.
    * @param {number} dy Vertical draw position.
    * @param {number} width Target width.
    * @param {number} height Target height.
    */
    drawFullSprite(ctx, img, dx, dy, width, height) {
        ctx.drawImage(img, dx, dy, width, height);
    }

    /**
    * Draws debug information for a character.
    * @param {*} ctx Rendering context.
    * @param {*} object Character object.
    * @param {{left: number, right: number, top: number, bottom: number}} off Offset values.
    * @param {number} x Horizontal position.
    * @param {number} y Vertical position.
    */
    drawCharacterDebug(ctx, object, off, x, y) {
        this.drawCharacterOuterBounds(ctx, object, x, y);
        this.drawCharacterBodyHitbox(ctx, object, off, x, y);
        this.drawCharacterAttackHitbox(ctx, object, x, y);
    }

    /**
    * Draws the outer bounds of a character.
    * @param {*} ctx Rendering context.
    * @param {{width: number, height: number}} object Character dimensions.
    * @param {number} x Horizontal position.
    * @param {number} y Vertical position.
    */
    drawCharacterOuterBounds(ctx, object, x, y) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(x, y, object.width, object.height);
    }

    /**
    * Draws the body hitbox of a character.
    * @param {*} ctx Rendering context.
    * @param {{width: number, height: number}} object Character dimensions.
    * @param {{left: number, right: number, top: number, bottom: number}} off Offset values.
    * @param {number} x Horizontal position.
    * @param {number} y Vertical position.
    */
    drawCharacterBodyHitbox(ctx, object, off, x, y) {
        ctx.strokeStyle = 'blue';
        const width = object.width - off.left - off.right;
        const height = object.height - off.top - off.bottom;
        const rectX = x + off.left;
        const rectY = y + off.top;
        ctx.strokeRect(rectX, rectY, width, height);
    }

    /**
    * Draws the attack hitbox of a character if active.
    * @param {*} ctx Rendering context.
    * @param {{width: number, height: number, attackHitbox?: {left: number, right: number, top: number, bottom: number, active: boolean}}} object Character data.
    * @param {number} x Horizontal position.
    * @param {number} y Vertical position.
    */
    drawCharacterAttackHitbox(ctx, object, x, y) {
        const hb = object.attackHitbox;
        if (!hb?.active) return;
        const width = object.width - hb.left - hb.right;
        const height = object.height - hb.top - hb.bottom;
        const rectX = x + hb.left;
        const rectY = y + hb.top;
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(rectX, rectY, width, height);
    }

    /**
    * Draws debug information for a flipped character.
    * @param {*} ctx Rendering context.
    * @param {*} object Character object.
    * @param {{left: number, right: number, top: number, bottom: number}} off Offset values.
    */
    drawCharacterDebugFlipped(ctx, object, off) {
        this.drawFlippedOuterBounds(ctx, object);
        this.drawFlippedBodyHitbox(ctx, object, off);
        this.drawFlippedAttackHitbox(ctx, object);
    }

    /**
    * Draws the outer bounds of a flipped character.
    * @param {*} ctx Rendering context.
    * @param {{width: number, height: number}} object Character dimensions.
    */
    drawFlippedOuterBounds(ctx, object) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(0, 0, object.width, object.height);
    }

    /**
    * Draws the body hitbox of a flipped character.
    * @param {*} ctx Rendering context.
    * @param {{width: number, height: number}} object Character dimensions.
    * @param {{left: number, right: number, top: number, bottom: number}} off Offset values.
    */
    drawFlippedBodyHitbox(ctx, object, off) {
        const width = object.width - off.left - off.right;
        const height = object.height - off.top - off.bottom;
        const rectX = off.left;
        const rectY = off.top;
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(rectX, rectY, width, height);
    }

    /**
    * Draws the attack hitbox of a flipped character if active.
    * @param {*} ctx Rendering context.
    * @param {{width: number, height: number, attackHitbox?: {left: number, right: number, top: number, bottom: number, active: boolean}}} object Character data.
    */
    drawFlippedAttackHitbox(ctx, object) {
        const hb = object.attackHitbox;
        if (!hb?.active) return;
        const width = object.width - hb.left - hb.right;
        const height = object.height - hb.top - hb.bottom;
        const attackX = object.width - hb.right - width;
        const attackY = hb.top;
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(attackX, attackY, width, height);
    }
}