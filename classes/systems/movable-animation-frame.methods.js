export const movableAnimationFrameMethods = {

    /**
     * Applies the next animation frame from an image array.
     * @param {HTMLImageElement[]} images Image frames.
     * @returns {void}
     */
    applyNextFrame(images) {
        if (!images || !images.length) return;
        this.img = images[this.frameIndex % images.length];
        this.frameSource = null;
    },

    /**
     * Applies the next animation frame from a sprite sheet.
     * @param {Object} sheet Sprite sheet definition.
     * @returns {void}
     */
    applyNextSheetFrame(sheet) {
        if (!sheet?.meta) return;
        const animDef = this.getSheetAnimDef(sheet);
        const range = this.getSheetFrameRange(animDef, sheet.meta);
        const frame = this.getSheetFrameIndex(range.from, range.count);
        const pos = this.getSheetGridPosition(frame, sheet.meta);
        this.setSheetFrameSource(sheet.image, sheet.meta, pos.col, pos.row);
    },

    /**
     * Resolves the animation definition from a sprite sheet.
     * @param {Object} sheet Sprite sheet definition.
     * @returns {Object} Animation definition.
     */
    getSheetAnimDef(sheet) {
        const meta = sheet.meta;
        const animName = sheet.anim ?? this.currentAnimation;
        return (
            meta.animations?.[animName] ??
            meta.animations?.default ??
            { from: 0, to: meta.frames - 1 }
        );
    },

    /**
     * Calculates the frame range for a sprite sheet animation.
     * @param {Object} animDef Animation definition.
     * @param {Object} meta Sprite sheet metadata.
     * @returns {{from:number, to:number, count:number}} Frame range.
     */
    getSheetFrameRange(animDef, meta) {
        const from = animDef.from ?? 0;
        const to = animDef.to ?? (meta.frames - 1);
        const count = to - from + 1;
        return { from, to, count };
    },

    /**
     * Calculates the current frame index within a sprite sheet animation range.
     * @param {number} from Start frame index.
     * @param {number} count Number of frames in the range.
     * @returns {number} Frame index.
     */
    getSheetFrameIndex(from, count) {
        return from + (this.frameIndex % count);
    },

    /**
     * Calculates the grid position of a frame in a sprite sheet.
     * @param {number} frame Frame index.
     * @param {Object} meta Sprite sheet metadata.
     * @returns {{col:number, row:number}} Grid position.
     */
    getSheetGridPosition(frame, meta) {
        const col = frame % meta.columns;
        const row = Math.floor(frame / meta.columns);
        return { col, row };
    },

    /**
     * Sets the source region for the current sprite sheet frame.
     * @param {HTMLImageElement} image Sprite sheet image.
     * @param {Object} meta Sprite sheet metadata.
     * @param {number} col Frame column index.
     * @param {number} row Frame row index.
     * @returns {void}
     */
    setSheetFrameSource(image, meta, col, row) {
        this.img = image;
        this.frameSource = {
            sx: col * meta.frameWidth,
            sy: row * meta.frameHeight,
            sw: meta.frameWidth,
            sh: meta.frameHeight
        };
    },

    /**
     * Resolves the animation definition for a sprite sheet.
     * @param {Object} meta Sprite sheet metadata.
     * @param {string} animName Animation name.
     * @returns {Object} Animation definition.
     */
    getSheetDef(meta, animName) {
        const anims = meta.animations ?? {};
        return anims[animName] ?? anims.default ?? {
            from: 0,
            to: meta.frames - 1
        };
    },

    /**
     * Calculates the number of frames in an animation range.
     * @param {Object} def Animation definition.
     * @param {number} totalFrames Total frames in the sprite sheet.
     * @returns {number} Frame count.
     */
    getFrameCount(def, totalFrames) {
        const from = def.from ?? 0;
        const to = def.to ?? (totalFrames - 1);
        return to - from + 1;
    },

    /**
     * Returns the frame count for a given animation source.
     * @param {*} anim Animation source definition.
     * @param {string} [animName] Animation name.
     * @returns {number} Frame count.
     */
    getFrameCountForSource(anim, animName = this.currentAnimation) {
        if (!anim) return 0;
        if (Array.isArray(anim)) return anim.length;
        if (anim.type === 'sheet') return this.getSheetSourceFrameCount(anim, animName);
        if (anim.type === 'sheetSequence') return this.getSheetSequenceSourceFrameCount(anim, animName);
        return 0;
    },

    /**
     * Returns the frame count for a sprite sheet animation source.
     * @param {Object} anim Animation source definition.
     * @param {string} animName Animation name.
     * @returns {number} Frame count.
     */
    getSheetSourceFrameCount(anim, animName) {
        const def = this.getSheetDef(anim.meta, anim.anim ?? animName);
        return this.getFrameCount(def, anim.meta.frames);
    },

    /**
     * Returns the total frame count for a sheet sequence animation source.
     * @param {Object} anim Animation source definition.
     * @param {string} animName Animation name.
     * @returns {number} Total frame count.
     */
    getSheetSequenceSourceFrameCount(anim, animName) {
        let total = 0;
        for (const sheet of anim.sheets ?? []) {
            total += this.getSingleSequenceSheetFrameCount(sheet, animName);
        }
        return total;
    },

    /**
     * Returns the frame count for a single sheet in a sequence.
     * @param {Object} sheet Sprite sheet definition.
     * @param {string} animName Animation name.
     * @returns {number} Frame count.
     */
    getSingleSequenceSheetFrameCount(sheet, animName) {
        const def = this.getSheetDef(sheet.meta, sheet.anim ?? animName);
        return this.getFrameCount(def, sheet.meta.frames);
    },

    /**
     * Applies the first frame of an animation source.
     * @param {*} anim Animation source definition.
     * @param {string} [animName] Animation name.
     * @returns {void}
     */
    applyFirstFrameOfSource(anim, animName = this.currentAnimation) {
        if (!anim) return;
        if (this.applyFirstArrayFrame(anim)) return;
        if (this.applyFirstSheetFrame(anim, animName)) return;
        this.applyFirstSheetSequenceFrame(anim, animName);
    },

    /**
     * Applies the first frame when the animation source is an array.
     * @param {*} anim Animation source definition.
     * @returns {boolean} True if handled as array animation.
     */
    applyFirstArrayFrame(anim) {
        if (!Array.isArray(anim)) return false;
        if (!anim.length) return true;
        this.img = anim[0];
        this.frameSource = null;
        return true;
    },

    /**
     * Applies the first frame of a sprite sheet animation.
     * @param {Object} anim Animation source definition.
     * @param {string} animName Animation name.
     * @returns {boolean} True if handled as sheet animation.
     */
    applyFirstSheetFrame(anim, animName) {
        if (anim.type !== 'sheet') return false;
        this.applySheetFrameAt(anim, 0, anim.anim ?? animName);
        return true;
    },

    /**
     * Applies the first frame of a sheet sequence animation.
     * @param {Object} anim Animation source definition.
     * @param {string} animName Animation name.
     * @returns {void}
     */
    applyFirstSheetSequenceFrame(anim, animName) {
        if (anim.type !== 'sheetSequence') return;
        const firstSheet = anim.sheets?.[0];
        if (!firstSheet) return;
        this.applySheetFrameAt(firstSheet, 0, firstSheet.anim ?? animName);
    },

    /**
     * Applies a specific frame from a sprite sheet.
     * @param {Object} sheet Sprite sheet definition.
     * @param {number} [localFrameIndex=0] Local frame index within the animation.
     * @param {string} [animName] Animation name.
     * @returns {void}
     */
    applySheetFrameAt(sheet, localFrameIndex = 0, animName = this.currentAnimation) {
        if (!sheet?.meta) return;
        const def = this.getSheetDef(sheet.meta, animName);
        const from = def.from ?? 0;
        const to = def.to ?? (sheet.meta.frames - 1);
        const count = to - from + 1;
        const safeIndex = Math.max(0, Math.min(localFrameIndex, count - 1));
        const frame = from + safeIndex;
        const col = frame % sheet.meta.columns;
        const row = Math.floor(frame / sheet.meta.columns);
        this.setSheetFrameSource(sheet.image, sheet.meta, col, row);
    }
}