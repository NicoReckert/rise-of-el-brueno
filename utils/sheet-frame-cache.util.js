/**
 * Builds cached canvas frames for a sprite sheet animation.
 * @param {Object} sheet Sprite sheet configuration.
 * @param {string} animName Animation name.
 * @param {number} targetWidth Target frame width.
 * @param {number} targetHeight Target frame height.
 * @returns {Array} Array of cached frame canvases with animation metadata.
 */
export function buildCachedSheetFrames(sheet, animName, targetWidth, targetHeight) {
    const state = getCachedSheetFrameState(sheet, animName);
    if (!state) return [];
    const frames = [];
    for (let frame = state.from; frame <= state.to; frame++) {
        frames.push(buildCachedSheetFrameCanvas(sheet, state.meta, frame, targetWidth, targetHeight));
    }
    frames._animMeta = buildCachedSheetAnimMeta(state);
    return frames;
}

/**
 * Resolves animation frame state for a cached sprite sheet.
 * @param {Object} sheet Sprite sheet configuration.
 * @param {string} animName Animation name.
 * @returns {Object|null} Resolved frame state or null if unavailable.
 */
function getCachedSheetFrameState(sheet, animName) {
    if (!sheet?.meta || !sheet?.image) return null;
    const meta = sheet.meta;
    const resolvedAnimName = sheet.anim ?? animName;
    const animDef = getCachedSheetAnimDef(meta, resolvedAnimName);
    const from = animDef.from ?? 0;
    const to = animDef.to ?? (meta.frames - 1);
    return { meta, animDef, from, to, resolvedAnimName };
}

/**
 * Retrieves the animation definition from sprite sheet metadata.
 * @param {Object} meta Sprite sheet metadata.
 * @param {string} animName Animation name.
 * @returns {Object} Animation definition with frame range.
 */
function getCachedSheetAnimDef(meta, animName) {
    return meta.animations?.[animName] ?? meta.animations?.default ?? { from: 0, to: meta.frames - 1 };
}

/**
 * Builds a cached canvas for a specific frame from a sprite sheet.
 * @param {Object} sheet Sprite sheet configuration.
 * @param {Object} meta Sprite sheet metadata.
 * @param {number} frame Frame index.
 * @param {number} targetWidth Target frame width.
 * @param {number} targetHeight Target frame height.
 * @returns {HTMLCanvasElement} Canvas containing the rendered frame.
 */
function buildCachedSheetFrameCanvas(sheet, meta, frame, targetWidth, targetHeight) {
    const src = getCachedSheetFrameSource(meta, frame);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(sheet.image, src.sx, src.sy, src.sw, src.sh, 0, 0, targetWidth, targetHeight);
    return canvas;
}

/**
 * Calculates the source rectangle for a frame in a sprite sheet.
 * @param {Object} meta Sprite sheet metadata.
 * @param {number} frame Frame index.
 * @returns {Object} Source rectangle coordinates and size.
 */
function getCachedSheetFrameSource(meta, frame) {
    const col = frame % meta.columns;
    const row = Math.floor(frame / meta.columns);
    return {
        sx: col * meta.frameWidth,
        sy: row * meta.frameHeight,
        sw: meta.frameWidth,
        sh: meta.frameHeight
    };
}

/**
 * Builds animation metadata for cached sprite sheet frames.
 * @param {Object} params Animation state parameters.
 * @param {string} params.resolvedAnimName Resolved animation name.
 * @param {number} params.from Start frame index.
 * @param {number} params.to End frame index.
 * @param {Object} params.animDef Animation definition.
 * @returns {Object} Animation metadata object.
 */
function buildCachedSheetAnimMeta({ resolvedAnimName, from, to, animDef }) {
    return {
        type: 'cached-sheet-frames',
        animName: resolvedAnimName,
        from,
        to,
        loop: animDef.loop !== false
    };
}