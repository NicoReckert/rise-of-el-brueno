import { buildCachedSheetFrames } from './sheet-frame-cache.util.js';

const effectAnimationCacheStore = new WeakMap();

/**
 * Retrieves cached animation frames for an effect animation.
 * @param {Object} anim Effect animation definition.
 * @param {string} animName Animation name.
 * @param {number} width Target frame width.
 * @param {number} height Target frame height.
 * @returns {Array|Object|null} Cached frames, original animation, or null if unavailable.
 */
export function getCachedEffectAnimation(anim, animName, width, height) {
    if (!anim) return null;
    if (anim.type !== 'sheet') return anim;
    return getOrBuildCachedEffectAnimation(anim, animName, width, height);
}

/**
 * Retrieves or builds cached frames for an effect animation.
 * @param {Object} anim Effect animation definition.
 * @param {string} animName Animation name.
 * @param {number} width Target frame width.
 * @param {number} height Target frame height.
 * @returns {Array} Cached animation frames.
 */
function getOrBuildCachedEffectAnimation(anim, animName, width, height) {
    let perAnimCache = effectAnimationCacheStore.get(anim);
    if (!perAnimCache) {
        perAnimCache = new Map();
        effectAnimationCacheStore.set(anim, perAnimCache);
    }
    const key = `${animName}::${width}x${height}`;
    if (perAnimCache.has(key)) return perAnimCache.get(key);
    const cached = buildCachedSheetFrames(anim, animName, width, height);
    perAnimCache.set(key, cached);
    return cached;
}