import { EntityFrameCacheConfig } from '../config/entity-frame-cache-config.js';
import { buildCachedSheetFrames } from './sheet-frame-cache.util.js';

const entityAnimationCacheStore = new Map();

/**
 * Retrieves cached animation frames for an entity animation.
 * @param {Object} entityImages Entity image definitions.
 * @param {string} entityName Entity name.
 * @param {string} animName Animation name.
 * @returns {Array|Object|null} Cached frames, original animation, or null if unavailable.
 */
export function getCachedEntityAnimation(entityImages, entityName, animName) {
    const original = entityImages?.[entityName]?.[animName];
    if (!original) return null;
    const cfg = EntityFrameCacheConfig?.[entityName]?.[animName];
    if (!cfg || original.type !== 'sheet') return original;
    return getOrBuildCachedEntityAnimation(original, entityName, animName, cfg);
}

/**
 * Retrieves or builds cached frames for an entity animation.
 * @param {Object} original Original animation definition.
 * @param {string} entityName Entity name.
 * @param {string} animName Animation name.
 * @param {Object} cfg Cache configuration.
 * @returns {Array} Cached animation frames.
 */
function getOrBuildCachedEntityAnimation(original, entityName, animName, cfg) {
    const cacheKey = `${entityName}::${animName}::${cfg.width}x${cfg.height}`;
    if (entityAnimationCacheStore.has(cacheKey)) {
        return entityAnimationCacheStore.get(cacheKey);
    }
    const cached = buildCachedSheetFrames(original, animName, cfg.width, cfg.height);
    entityAnimationCacheStore.set(cacheKey, cached);
    return cached;
}

/**
 * Retrieves cached animation frames using a configuration key.
 * @param {Object} source Animation source definition.
 * @param {string} configGroup Configuration group name.
 * @param {string} configKey Configuration key name.
 * @param {string} [animName='default'] Animation name.
 * @returns {Array|Object|null} Cached frames, original animation, or null if unavailable.
 */
export function getCachedAnimationByConfigKey(source, configGroup, configKey, animName = 'default') {
    if (!source) return null;
    const cfg = EntityFrameCacheConfig?.[configGroup]?.[configKey];
    if (!cfg || source.type !== 'sheet') return source;
    return getOrBuildCachedAnimationByConfigKey(source, configGroup, configKey, animName, cfg);
}

/**
 * Retrieves or builds cached frames for an animation using a configuration key.
 * @param {Object} source Animation source definition.
 * @param {string} configGroup Configuration group name.
 * @param {string} configKey Configuration key name.
 * @param {string} animName Animation name.
 * @param {Object} cfg Cache configuration.
 * @returns {Array} Cached animation frames.
 */
function getOrBuildCachedAnimationByConfigKey(source, configGroup, configKey, animName, cfg) {
    const cacheKey = `${configGroup}::${configKey}::${cfg.width}x${cfg.height}`;
    if (entityAnimationCacheStore.has(cacheKey)) {
        return entityAnimationCacheStore.get(cacheKey);
    }
    const cached = buildCachedSheetFrames(source, animName, cfg.width, cfg.height);
    entityAnimationCacheStore.set(cacheKey, cached);
    return cached;
}