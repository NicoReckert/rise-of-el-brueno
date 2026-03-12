export const movableAnimationUpdateMethods = {

    /**
     * Updates animation frames from different animation source types.
     * @param {*} anim Animation source definition.
     * @param {Object} [opts] Animation options.
     * @returns {void}
     */
    updateAnimationFromSourceGeneric(anim, opts = {}) {
        if (!anim) return;
        const options = this.getAnimationSourceOptions(opts);
        if (this.handleArrayAnimationSource(anim, options)) return;
        if (this.handleSheetSequenceSource(anim, options)) return;
        this.handleSheetSource(anim, options);
    },

    /**
     * Resolves animation source options with default values.
     * @param {Object} [options]
     * @param {boolean} [options.isOneShot=false]
     * @param {Function|null} [options.onFinished=null]
     * @param {boolean} [options.allowLoop=true]
     * @returns {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} Animation options.
     */
    getAnimationSourceOptions({
        isOneShot = false,
        onFinished = null,
        allowLoop = true
    } = {}) {
        return { isOneShot, onFinished, allowLoop };
    },

    /**
     * Handles animation updates when the source is an array of frames.
     * @param {*} anim Animation source.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {boolean} True if handled as array animation.
     */
    handleArrayAnimationSource(anim, options) {
        if (!Array.isArray(anim)) return false;
        if (!anim.length) return true;
        this.stepArrayAnimation(anim, options);
        return true;
    },

    /**
     * Handles animation updates when the source is a sheet sequence.
     * @param {Object} anim Animation source definition.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {boolean} True if handled as sheet sequence animation.
     */
    handleSheetSequenceSource(anim, options) {
        if (anim.type !== 'sheetSequence') return false;
        this.stepSheetSequenceAnimation(anim, options);
        return true;
    },

    /**
     * Handles animation updates when the source is a sprite sheet.
     * @param {Object} anim Animation source definition.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {void}
     */
    handleSheetSource(anim, options) {
        if (anim.type !== 'sheet') return;
        this.stepSheetAnimation(anim, options);
    },

    /**
     * Advances an array-based animation by one frame.
     * @param {HTMLImageElement[]} images Animation frames.
     * @param {{isOneShot:boolean, onFinished:Function|null}} options Animation options.
     * @returns {void}
     */
    stepArrayAnimation(images, { isOneShot, onFinished }) {
        this.applyNextFrame(images);
        if (typeof this.handleDeferredSizeUpdate === 'function') {
            this.handleDeferredSizeUpdate();
        }
        this.frameIndex++;
        if (isOneShot && this.frameIndex >= images.length) {
            this.animationFinished = true;
            onFinished?.();
        }
    },

    /**
     * Advances a sprite sheet animation by one frame.
     * @param {Object} anim Animation source definition.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {void}
     */
    stepSheetAnimation(anim, options) {
        this.prepareNextSheetFrame(anim);
        this.frameIndex++;
        const state = this.getSheetAnimationState(anim);
        if (this.frameIndex < state.count) return;
        this.resolveSheetAnimationEnd(state, options);
    },

    /**
     * Prepares the next sprite sheet frame for rendering.
     * @param {Object} anim Animation source definition.
     * @returns {void}
     */
    prepareNextSheetFrame(anim) {
        this.applyNextSheetFrame(anim);
        if (typeof this.handleDeferredSizeUpdate === 'function') {
            this.handleDeferredSizeUpdate();
        }
    },

    /**
     * Returns the current sprite sheet animation state.
     * @param {Object} anim Animation source definition.
     * @returns {{def:Object, count:number}} Animation state.
     */
    getSheetAnimationState(anim) {
        const name = anim.anim ?? this.currentAnimation;
        const def = this.getSheetDef(anim.meta, name);
        const count = this.getFrameCount(def, anim.meta.frames);
        return { def, count };
    },

    /**
     * Resolves behavior when a sprite sheet animation reaches its end.
     * @param {{def:Object}} state Animation state.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {void}
     */
    resolveSheetAnimationEnd({ def }, { isOneShot, onFinished, allowLoop }) {
        const loopDef = def.loop !== false;
        if (!isOneShot && allowLoop && loopDef) {
            this.frameIndex = 0;
            return;
        }
        this.animationFinished = true;
        onFinished?.();
    },

    /**
     * Advances a sheet-sequence animation by one frame.
     * @param {Object} anim Animation source definition.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {void}
     */
    stepSheetSequenceAnimation(anim, options) {
        const sheets = anim.sheets ?? [];
        const sheet = sheets[this.sheetIndex];
        if (!sheet) return;
        this.prepareNextSheetFrame(sheet);
        this.frameIndex++;
        const count = this.getSheetSequenceFrameCount(sheet);
        if (this.frameIndex < count) return;
        this.advanceSheetSequence(anim, sheets, options);
    },

    /**
     * Calculates the frame count for a sheet sequence animation.
     * @param {Object} sheet Sprite sheet definition.
     * @returns {number} Frame count.
     */
    getSheetSequenceFrameCount(sheet) {
        const def = this.getSheetDef(sheet.meta, this.currentAnimation);
        return this.getFrameCount(def, sheet.meta.frames);
    },

    /**
     * Advances to the next sheet in a sheet-sequence animation.
     * @param {Object} anim Animation source definition.
     * @param {Object[]} sheets Sprite sheet sequence.
     * @param {{isOneShot:boolean, onFinished:Function|null, allowLoop:boolean}} options Animation options.
     * @returns {void}
     */
    advanceSheetSequence(anim, sheets, { isOneShot, onFinished, allowLoop }) {
        this.frameIndex = 0;
        this.sheetIndex++;
        const atEnd = this.sheetIndex >= sheets.length;
        if (!atEnd) return;
        if (!isOneShot && allowLoop && !!anim.loop) return void (this.sheetIndex = 0);
        this.sheetIndex = Math.max(0, sheets.length - 1);
        this.animationFinished = true;
        onFinished?.();
    }
}