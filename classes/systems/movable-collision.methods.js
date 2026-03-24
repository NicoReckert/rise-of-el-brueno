export const movableCollisionMethods = {

    /**
     * Checks whether this object collides with another object.
     * @param {Object} object Target object.
     * @param {Object} [toleranceA] Collision tolerance for this object.
     * @param {Object} [toleranceB] Collision tolerance for the target object.
     * @param {Object} [options] Collision options.
     * @returns {boolean} True if the objects collide.
     */
    isColliding(object, toleranceA = { x: 0, y: 0, width: 0, height: 0 }, toleranceB = { x: 0, y: 0, width: 0, height: 0 }, options = {}) {
        if (!object) return false;
        const boxA = this.getCollisionBox(this, toleranceA, {
            hitbox: options.hitboxA,
            useAttackHitbox: options.useAttackHitboxA
        });
        const boxB = this.getCollisionBox(object, toleranceB, {
            hitbox: options.hitboxB,
            useAttackHitbox: options.useAttackHitboxB
        });
        return this.boxesOverlap(boxA, boxB);
    },

    /**
     * Calculates the collision box for an entity.
     * @param {Object} entity Entity used for collision calculation.
     * @param {Object} [tolerance={}] Collision tolerance values.
     * @param {Object} [options={}] Collision options.
     * @returns {{left:number, right:number, top:number, bottom:number}} Collision box.
     */
    getCollisionBox(entity, tolerance = {}, options = {}) {
        const hb = this.getCollisionHitbox(entity, options.hitbox, options.useAttackHitbox);
        const x = this.getCollisionX(entity, options.useAttackHitbox);
        return this.buildCollisionBox(entity, hb, x, tolerance);
    },

    /**
     * Builds a normalized collision box using hitbox and tolerance values.
     * @param {Object} entity Entity used for collision calculation.
     * @param {Object} hb Hitbox definition.
     * @param {number} x Base x-position used for collision calculation.
     * @param {Object} tolerance Collision tolerance values.
     * @returns {{left:number, right:number, top:number, bottom:number}} Collision box.
     */
    buildCollisionBox(entity, hb, x, tolerance) {
        const tx = tolerance.x ?? 0, ty = tolerance.y ?? 0;
        const tw = tolerance.width ?? 0, th = tolerance.height ?? 0;
        const left = entity.isFlipped ? x + hb.right + tx : x + hb.left + tx;
        const right = entity.isFlipped ? x + entity.width - hb.left - tw : x + entity.width - hb.right - tw;
        const top = entity.y + hb.top + ty;
        const bottom = entity.y + entity.height - hb.bottom - th;
        return this.normalizeCollisionBox(left, right, top, bottom);
    },

    /**
     * Resolves the hitbox used for collision calculation.
     * @param {Object} entity Entity used for collision calculation.
     * @param {Object} customHitbox Custom hitbox override.
     * @param {boolean} useAttackHitbox Whether to use the attack hitbox if active.
     * @returns {Object} Resolved hitbox.
     */
    getCollisionHitbox(entity, customHitbox, useAttackHitbox) {
        return customHitbox ??
            (useAttackHitbox && entity.attackHitbox?.active ? entity.attackHitbox : null) ??
            entity.offset ??
            { top: 0, left: 0, right: 0, bottom: 0 };
    },

    /**
     * Returns the collision x position of an entity.
     * @param {Object} entity Target entity.
     * @param {boolean} useAttackHitbox Whether to use attack hitbox.
     * @returns {number} Collision x position.
     */
    getCollisionX(entity, useAttackHitbox) {
        if (typeof entity?.getCollisionBaseX === "function") {
            return entity.getCollisionBaseX(useAttackHitbox);
        }
        const shouldUseRenderX = !!(useAttackHitbox && entity.attackHitbox?.active);
        if (shouldUseRenderX && typeof entity.getRenderX === "function") {
            return entity.getRenderX();
        }
        return entity.x ?? 0;
    },

    /**
     * Normalizes collision box coordinates.
     * @param {number} left Left coordinate.
     * @param {number} right Right coordinate.
     * @param {number} top Top coordinate.
     * @param {number} bottom Bottom coordinate.
     * @returns {{left:number, right:number, top:number, bottom:number}} Normalized collision box.
     */
    normalizeCollisionBox(left, right, top, bottom) {
        return {
            left: Math.min(left, right),
            right: Math.max(left, right),
            top: Math.min(top, bottom),
            bottom: Math.max(top, bottom)
        };
    },

    /**
     * Checks whether two collision boxes overlap.
     * @param {{left:number, right:number, top:number, bottom:number}} a First collision box.
     * @param {{left:number, right:number, top:number, bottom:number}} b Second collision box.
     * @returns {boolean} True if the boxes overlap.
     */
    boxesOverlap(a, b) {
        return (
            a.right > b.left &&
            a.left < b.right &&
            a.bottom > b.top &&
            a.top < b.bottom
        );
    },

    /**
     * Checks whether this object lands on top of another object.
     * @param {Object} object Target object.
     * @returns {boolean} True if a jump-on collision occurred.
     */
    isJumpOn(object) {
        const a = this.getJumpBox(this);
        const b = this.getJumpBox(object);
        if (!this.isHorizontallyAligned(a, b)) return false;
        if (!this.isFallingDown()) return false;
        if (!this.isCrossingFromTop(a, b)) return false;
        return this.isJumpCenterAligned(a, b, object.width);
    },

    /**
     * Returns the jump collision box of an entity.
     * @param {Object} entity Target entity.
     * @returns {Object} Jump box.
     */
    getJumpBox(entity) {
        const x = typeof entity?.getCollisionBaseX === "function"
            ? entity.getCollisionBaseX(false)
            : (entity.x ?? 0);
        const offset = entity.offset ?? { top: 0, left: 0, right: 0, bottom: 0 };
        const left = entity.isFlipped
            ? x + offset.right
            : x + offset.left;
        const right = entity.isFlipped
            ? x + entity.width - offset.left
            : x + entity.width - offset.right;
        const top = entity.y + offset.top;
        const bottom = entity.y + entity.height - offset.bottom;
        return { left, right, top, bottom };
    },

    /**
     * Checks whether two boxes are horizontally aligned.
     * @param {{left:number, right:number}} a First box.
     * @param {{left:number, right:number}} b Second box.
     * @returns {boolean} True if horizontally aligned.
     */
    isHorizontallyAligned(a, b) {
        return a.right > b.left && a.left < b.right;
    },

    /**
     * Checks whether the object is currently falling downward.
     * @returns {boolean} True if falling.
     */
    isFallingDown() {
        return this.speedY < 0;
    },

    /**
     * Checks whether the object crosses another box from above.
     * @param {{top:number, bottom:number}} a Current box of this object.
     * @param {{top:number, bottom:number}} b Target box.
     * @returns {boolean} True if crossing from top.
     */
    isCrossingFromTop(a, b) {
        const prevBottom = this.prevBottom ?? a.bottom;
        const wasAboveHead = prevBottom <= b.top;
        const nowCrossFromTop = a.bottom >= b.top - 10 && a.top < b.bottom;
        return wasAboveHead && nowCrossFromTop;
    },

    /**
     * Checks whether the jump centers are aligned within the allowed offset.
     * @param {{left:number, right:number}} a First box.
     * @param {{left:number, right:number}} b Second box.
     * @param {number} objectWidth Width of the target object.
     * @returns {boolean} True if centers are aligned.
     */
    isJumpCenterAligned(a, b, objectWidth) {
        const aCenterX = (a.left + a.right) / 2;
        const bCenterX = (b.left + b.right) / 2;
        const maxSideOffset = objectWidth * 0.6;
        return Math.abs(aCenterX - bCenterX) <= maxSideOffset;
    },

    /**
     * Returns the hitbox rectangle of the entity.
     * @returns {Object} Hitbox rectangle with bounds and center.
     */
    getHitboxRect() {
        const x = typeof this.getCollisionBaseX === "function"
            ? this.getCollisionBaseX(false)
            : (this.x ?? 0);
        const { left, right } = this.getHitboxXBounds(x);
        const offset = this.offset ?? { top: 0, left: 0, right: 0, bottom: 0 };
        const top = this.y + offset.top;
        const bottom = this.y + this.height - offset.bottom;
        return { left, right, top, bottom, cx: (left + right) * 0.5, cy: (top + bottom) * 0.5 };
    },

    /**
     * Calculates the horizontal hitbox bounds for the entity.
     * @param {number} x Base x-position of the entity.
     * @returns {{left:number, right:number}} Horizontal hitbox bounds.
     */
    getHitboxXBounds(x) {
        const offset = this.offset ?? { top: 0, left: 0, right: 0, bottom: 0 };
        if (this.isFlipped) {
            return {
                left: x + offset.right,
                right: x + this.width - offset.left
            };
        }
        return {
            left: x + offset.left,
            right: x + this.width - offset.right
        };
    }
}