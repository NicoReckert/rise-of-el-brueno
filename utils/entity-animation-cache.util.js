import { EntityFrameCacheConfig } from '../config/entity-frame-cache-config.js';
import { buildCachedSheetFrames } from './sheet-frame-cache.util.js';

const entityAnimationCacheStore = new Map();

export function getCachedEntityAnimation(entityImages, entityName, animName) {
    const original = entityImages?.[entityName]?.[animName];
    if (!original) return null;

    const cfg = EntityFrameCacheConfig?.[entityName]?.[animName];
    if (!cfg) return original;

    if (original.type !== 'sheet') return original;

    const cacheKey = `${entityName}::${animName}::${cfg.width}x${cfg.height}`;

    if (entityAnimationCacheStore.has(cacheKey)) {
        return entityAnimationCacheStore.get(cacheKey);
    }

    const cached = buildCachedSheetFrames(
        original,
        animName,
        cfg.width,
        cfg.height
    );

    entityAnimationCacheStore.set(cacheKey, cached);
    return cached;
}