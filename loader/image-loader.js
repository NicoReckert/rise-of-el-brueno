const imageCache = new Map();
const jsonCache = new Map();

/**
 * Loads an image.
 * @param {string} src Image source path.
 * @param {{onFileLoaded?: Function|null}} [options={}] Options object.
 * @returns {Promise<HTMLImageElement|null>}
 */
function loadImage(src, options = {}) {
    const { onFileLoaded = null } = options;
    if (imageCache.has(src)) return imageCache.get(src);
    const promise = createImagePromise(src, { onFileLoaded });
    imageCache.set(src, promise);
    return promise;
}

/**
 * Creates an image loading promise.
 * @param {string} src Image source path.
 * @param {{onFileLoaded?: Function|null}} [options={}] Options object.
 * @returns {Promise<HTMLImageElement|null>}
 */
function createImagePromise(src, options = {}) {
    const { onFileLoaded = null } = options;
    return new Promise((resolve) => {
        const img = new Image();
        setupImageHandlers(img, src, { onFileLoaded }, resolve);
        img.src = src;
    });
}

/**
 * Sets up image event handlers.
 * @param {HTMLImageElement} img Image element.
 * @param {string} src Image source path.
 * @param {{onFileLoaded?: Function|null}} [options={}] Options object.
 * @param {Function} resolve Promise resolve function.
 * @returns {void}
 */
function setupImageHandlers(img, src, options = {}, resolve) {
    const { onFileLoaded = null } = options;
    img.onload = () => handleImageLoad(onFileLoaded, resolve, img);
    img.onerror = () => handleImageError(src, onFileLoaded, resolve);
}

/**
 * Handles image load.
 * @param {Function|null} onFileLoaded Load callback.
 * @param {Function} resolve Promise resolve function.
 * @param {HTMLImageElement} img Image element.
 * @returns {void}
 */
function handleImageLoad(onFileLoaded, resolve, img) {
    if (onFileLoaded) onFileLoaded();
    resolve(img);
}

/**
 * Handles image load errors by removing from cache and resolving null.
 * @param {string} src Image source URL.
 * @param {Function} [onFileLoaded] Optional progress callback.
 * @param {Function} resolve Promise resolve function.
 */
function handleImageError(src, onFileLoaded, resolve) {
    if (onFileLoaded) onFileLoaded();
    imageCache.delete(src);
    resolve(null);
}

/**
 * Preloads images from a manifest.
 * @param {*} manifest Manifest data.
 * @param {{onFileLoaded?: Function|null, concurrency?: number}} [options={}] Options object.
 * @returns {Promise<*>}
 */
export async function preloadManifestImages(manifest, options = {}) {
    const { onFileLoaded = null, concurrency = 4 } = options;
    return processManifestNode(manifest, onFileLoaded, { concurrency });
}

/**
 * Processes a manifest node.
 * @param {*} node Manifest node.
 * @param {Function} onFileLoaded Progress callback.
 * @param {Object} [config={}] Configuration object.
 * @returns {Promise<*|null>}
 */
async function processManifestNode(node, onFileLoaded, config = {}) {
    if (Array.isArray(node)) return processArrayNode(node, onFileLoaded, config);
    if (isSheetNode(node)) return processSheetNode(node, onFileLoaded);
    if (isSheetSequenceNode(node)) return processSheetSequenceNode(node, onFileLoaded);
    if (isPlainObject(node)) return processObjectNode(node, onFileLoaded, config);
    return null;
}

/**
 * Processes a manifest array node.
 * @param {Array<*>} list Manifest list.
 * @param {Function} onFileLoaded Progress callback.
 * @param {Object} [config={}] Configuration object.
 * @returns {Promise<Array<*>>}
 */
async function processArrayNode(list, onFileLoaded, config = {}) {
    const concurrency = config.concurrency ?? 4;
    const state = { list, onFileLoaded, results: new Array(list.length), nextIndex: 0, };
    const workers = createWorkers(
        Math.min(concurrency, list.length),
        () => workerLoop(state)
    );
    await Promise.all(workers);
    return state.results.filter(Boolean);
}

/**
 * Processes image loading tasks in a worker loop.
 * @param {{list: Array<*>, onFileLoaded?: Function|null, results: Array<*>, nextIndex: number}} state Worker state.
 * @returns {Promise<void>}
 */
async function workerLoop(state) {
    for (let currentIndex = getNextIndex(state);
        currentIndex !== null;
        currentIndex = getNextIndex(state)) {
        try {
            state.results[currentIndex] = await loadImage(
                state.list[currentIndex],
                { onFileLoaded: state.onFileLoaded }
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
 * Processes a sheet node.
 * @param {{json: string, anim?: *}} node Sheet node.
 * @param {Function|null} onFileLoaded Load callback.
 * @returns {Promise<{type: string, meta: *, image: HTMLImageElement, anim: *}|null>}
 */
async function processSheetNode(node, onFileLoaded) {
    const meta = await loadJSON(node.json);
    if (!meta) return null;
    const imageSrc = node.json.replace(/\.json$/, '.webp');
    const image = await loadImage(imageSrc, { onFileLoaded });
    if (!image) return null;
    return { type: 'sheet', meta, image, anim: node.anim ?? null };
}

/**
 * Processes a sprite sheet sequence node.
 * @param {Object} node Sheet sequence configuration.
 * @param {Function} [onFileLoaded] Optional progress callback.
 * @returns {Promise<Object|null>}
 */
async function processSheetSequenceNode(node, onFileLoaded) {
    const sheets = [];
    for (const entry of node.sheets) {
        const sheet = await loadSequenceEntry(entry, onFileLoaded);
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
 * Loads a sequence entry.
 * @param {{json: string}} entry Sequence entry.
 * @param {Function|null} onFileLoaded Load callback.
 * @returns {Promise<{type: string, meta: *, image: HTMLImageElement}|null>}
 */
async function loadSequenceEntry(entry, onFileLoaded) {
    const meta = await loadJSON(entry.json);
    if (!meta) return null;
    const imageSrc = entry.json.replace(/\.json$/, '.webp');
    const image = await loadImage(imageSrc, { onFileLoaded });
    if (!image) return null;
    return { type: 'sheet', meta, image };
}

/**
 * Processes a manifest object node.
 * @param {Object} obj Manifest object.
 * @param {Function} onFileLoaded Progress callback.
 * @param {Object} [config={}] Configuration object.
 * @returns {Promise<Object>}
 */
async function processObjectNode(obj, onFileLoaded, config = {}) {
    const entries = Object.entries(obj);
    const settled = await processEntries(entries, onFileLoaded, config);
    return buildResultFromSettled(settled);
}

/**
 * Processes manifest entries.
 * @param {Array<*>} entries Manifest entries.
 * @param {Function} onFileLoaded Progress callback.
 * @param {Object} [config={}] Configuration object.
 * @returns {Promise<Array<PromiseSettledResult<*>>>}
 */
async function processEntries(entries, onFileLoaded, config = {}) {
    return Promise.allSettled(
        entries.map(([key, value]) => processEntry(key, value, onFileLoaded, config))
    );
}

/**
 * Processes a manifest entry.
 * @param {*} key Entry key.
 * @param {*} value Entry value.
 * @param {Function} onFileLoaded Progress callback.
 * @param {Object} [config={}] Configuration object.
 * @returns {Promise<[*, *]>}
 */
async function processEntry(key, value, onFileLoaded, config = {}) {
    const processed = await processManifestNode(value, onFileLoaded, config);
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