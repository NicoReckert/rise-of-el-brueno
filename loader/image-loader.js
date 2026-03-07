const imageCache = new Map();
const jsonCache = new Map();

/**
 * Loads an image with optional progress callback, using cache.
 * @param {string} src Image source URL.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<HTMLImageElement|null>} Loaded image.
 */
function loadImage(src, onProgress) {
    if (imageCache.has(src)) return imageCache.get(src);
    const promise = createImagePromise(src, onProgress);
    imageCache.set(src, promise);
    return promise;
}

/**
 * Creates a promise to load an image.
 * @param {string} src Image source URL.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<HTMLImageElement|null>} Promise resolving with the loaded image.
 */
function createImagePromise(src, onProgress) {
    return new Promise((resolve) => {
        const img = new Image();
        setupImageHandlers(img, src, onProgress, resolve);
        img.src = src;
    });
}

/**
 * Sets up load and error handlers for an image.
 * @param {HTMLImageElement} img Image element.
 * @param {string} src Image source URL.
 * @param {Function} [onProgress] Optional progress callback.
 * @param {Function} resolve Promise resolve function.
 */
function setupImageHandlers(img, src, onProgress, resolve) {
    img.onload = () => handleImageLoad(src, onProgress, resolve, img);
    img.onerror = () => handleImageError(src, onProgress, resolve);
}

/**
 * Handles successful image load.
 * @param {string} src Image source URL.
 * @param {Function} [onProgress] Optional progress callback.
 * @param {Function} resolve Promise resolve function.
 * @param {HTMLImageElement} img Loaded image element.
 */
function handleImageLoad(src, onProgress, resolve, img) {
    if (onProgress) onProgress(src);
    resolve(img);
}

/**
 * Handles image load errors by removing from cache and resolving null.
 * @param {string} src Image source URL.
 * @param {Function} [onProgress] Optional progress callback.
 * @param {Function} resolve Promise resolve function.
 */
function handleImageError(src, onProgress, resolve) {
    if (onProgress) onProgress(src);
    imageCache.delete(src);
    resolve(null);
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
 * @returns {Promise<Array<HTMLImageElement>>} Loaded images.
 */
async function processArrayNode(list, onProgress) {
    const concurrency = 4;
    const state = { list, onProgress, results: new Array(list.length), nextIndex: 0, };
    const workers = createWorkers(
        Math.min(concurrency, list.length),
        () => workerLoop(state)
    );
    await Promise.all(workers);
    return state.results.filter(Boolean);
}

/**
 * Worker loop that loads images from the list.
 * @param {{list:Array<string>, onProgress:Function, results:Array, nextIndex:number}} state Worker state object.
 */
async function workerLoop(state) {
    for (let currentIndex = getNextIndex(state);
        currentIndex !== null;
        currentIndex = getNextIndex(state)) {
        try {
            state.results[currentIndex] = await loadImage(
                state.list[currentIndex],
                state.onProgress
            );
        } catch {
            state.results[currentIndex] = null;
        }
    }
}

/**
 * Returns the next index to process from the state.
 * @param {{list:Array, nextIndex:number}} state Worker state object.
 * @returns {number|null} Next index or null if finished.
 */
function getNextIndex(state) {
    if (state.nextIndex >= state.list.length) return null;
    return state.nextIndex++;
}

/**
 * Creates multiple worker promises.
 * @param {number} count Number of workers.
 * @param {Function} createWorker Function that returns a worker promise.
 * @returns {Array<Promise>} Array of worker promises.
 */
function createWorkers(count, createWorker) {
    return Array.from({ length: count }, () => createWorker());
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
 * Processes an object node of image sources or nested nodes.
 * @param {Object} obj Object with values to process.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Object>} Processed results object.
 */
async function processObjectNode(obj, onProgress) {
    const entries = Object.entries(obj);
    const settled = await processEntries(entries, onProgress);
    return buildResultFromSettled(settled);
}

/**
 * Processes multiple object entries concurrently.
 * @param {Array<[string, *]>} entries Key-value pairs to process.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<Array<PromiseSettledResult>>} Settled results.
 */
async function processEntries(entries, onProgress) {
    return Promise.allSettled(
        entries.map(([key, value]) => processEntry(key, value, onProgress))
    );
}

/**
 * Processes a single object entry.
 * @param {string} key Entry key.
 * @param {*} value Entry value.
 * @param {Function} [onProgress] Optional progress callback.
 * @returns {Promise<[string, *]>} Key and processed value.
 */
async function processEntry(key, value, onProgress) {
    const processed = await processManifestNode(value, onProgress);
    return [key, processed];
}

/**
 * Builds a result object from settled promise entries.
 * @param {Array<PromiseSettledResult>} settled Settled promise results.
 * @returns {Object} Processed results object.
 */
function buildResultFromSettled(settled) {
    const result = {};
    for (const entry of settled) {
        if (entry.status !== "fulfilled") continue;
        const [key, processed] = entry.value;
        if (processed != null) result[key] = processed;
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
 * Loads a JSON file, caching the result.
 * @param {string} src JSON file source URL.
 * @returns {Promise<*>} Parsed JSON data.
 */
async function loadJSON(src) {
    if (jsonCache.has(src)) return jsonCache.get(src);

    const promise = fetchJSON(src);
    jsonCache.set(src, promise);
    return promise;
}

/**
 * Fetches and parses a JSON file safely.
 * @param {string} src JSON file source URL.
 * @returns {Promise<*>} Parsed JSON data or failure.
 */
async function fetchJSON(src) {
    try {
        const res = await fetch(src);
        if (!res.ok) return cacheFail(src);
        const data = await parseJSONSafe(res);
        return data || cacheFail(src);
    } catch {
        return cacheFail(src);
    }
}

/**
 * Handles a failed JSON load by clearing the cache entry.
 * @param {string} src JSON file source URL.
 * @returns {null}
 */
function cacheFail(src) {
    jsonCache.delete(src);
    return null;
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