/**
 * Loads an image asynchronously.
 * @param {string} src Image source path.
 * @param {Function} [onProgress] Optional callback triggered after load attempt.
 * @returns {Promise<HTMLImageElement|null>}
 */
function loadImage(src, onProgress) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            if (onProgress) onProgress(src);
            resolve(img);
        };
        img.onerror = () => {
            if (onProgress) onProgress(src);
            resolve(null);
        };
        img.src = src;
    });
}

/**
 * Preloads images defined in a manifest.
 * @param {Object} manifest Image manifest configuration.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Object>}
 */
export async function preloadManifestImages(manifest, onProgress) {
    return processManifestNode(manifest, onProgress);
}

/**
 * Processes a manifest node based on its structure.
 * @param {*} node Manifest node.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<*>}
 */
async function processManifestNode(node, onProgress) {
    if (Array.isArray(node)) return processArrayNode(node, onProgress);
    if (isSheetNode(node)) return processSheetNode(node, onProgress);
    if (isSheetSequenceNode(node)) return processSheetSequenceNode(node, onProgress);
    if (isPlainObject(node)) return processObjectNode(node, onProgress);
    return null;
}

/**
 * Processes an array node of image sources.
 * @param {Array<string>} list Image source list.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Array<HTMLImageElement>>}
 */
async function processArrayNode(list, onProgress) {
    const results = [];
    for (const src of list) {
        const img = await loadImage(src, onProgress);
        if (img) results.push(img);
        await new Promise(r => requestIdleCallback(r, { timeout: 16 }));
    }
    return results;
}

/**
 * Processes a sprite sheet node.
 * @param {Object} node Sprite sheet configuration.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Object|null>}
 */
async function processSheetNode(node, onProgress) {
    const meta = await loadJSON(node.json);
    if (!meta) return null;
    const imageSrc = node.json.replace(/\.json$/, '.webp');
    const image = await loadImage(imageSrc, onProgress);
    if (!image) return null;
    return { type: 'sheet', meta, image, anim: node.anim ?? null };
}

/**
 * Processes a sprite sheet sequence node.
 * @param {Object} node Sheet sequence configuration.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Object|null>}
 */
async function processSheetSequenceNode(node, onProgress) {
    const sheets = [];
    for (const entry of node.sheets) {
        const sheet = await loadSequenceEntry(entry, onProgress);
        if (sheet) sheets.push(sheet);
    }
    if (!sheets.length) return null;
    return {
        type: 'sheetSequence',
        loop: node.loop !== false,
        sheets
    };
}

/**
 * Loads a single sprite sheet sequence entry.
 * @param {Object} entry Sequence entry configuration.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Object|null>}
 */
async function loadSequenceEntry(entry, onProgress) {
    const meta = await loadJSON(entry.json);
    if (!meta) return null;
    const imageSrc = entry.json.replace(/\.json$/, '.webp');
    const image = await loadImage(imageSrc, onProgress);
    if (!image) return null;
    return { type: 'sheet', meta, image };
}

/**
 * Processes an object node within a manifest.
 * @param {Object} obj Manifest object node.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Object>}
 */
async function processObjectNode(obj, onProgress) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const processed = await processManifestNode(value, onProgress);
        if (processed !== null && processed !== undefined) {
            result[key] = processed;
        }
    }
    return result;
}

/**
 * Checks whether a value is a plain object.
 * @param {*} node Value to check.
 * @returns {boolean}
 */
function isPlainObject(node) {
    return typeof node === 'object' && node !== null && !Array.isArray(node);
}

/**
 * Checks whether a node represents a sprite sheet configuration.
 * @param {*} node Value to check.
 * @returns {boolean}
 */
function isSheetNode(node) {
    return isPlainObject(node) && node.type === 'sheet';
}

/**
 * Checks whether a node represents a sprite sheet sequence configuration.
 * @param {*} node Value to check.
 * @returns {boolean}
 */
function isSheetSequenceNode(node) {
    return isPlainObject(node) && node.type === 'sheetSequence';
}

/**
 * Loads and parses a JSON resource.
 * @param {string} src JSON source path.
 * @returns {Promise<Object|null>}
 */
async function loadJSON(src) {
    try {
        const res = await fetch(src);
        if (!res.ok) return null;
        return await parseJSONSafe(res);
    } catch {
        return null;
    }
}

/**
 * Safely parses a JSON response.
 * @param {Response} response Fetch response object.
 * @returns {Promise<Object|null>}
 */
async function parseJSONSafe(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}