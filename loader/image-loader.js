const imageCache = new Map();
const jsonCache = new Map();

/**
 * Loads an image.
 * @param {string} src Image source path.
 * @param {{onFileLoaded?: Function|null}} [param1={}] Options object.
 * @returns {Promise<HTMLImageElement|null>}
 */
function loadImage(src, { onFileLoaded = null } = {}) {
    if (imageCache.has(src)) return imageCache.get(src);
    const promise = new Promise((resolve) => {
        const img = new Image();
        setupImageHandlers(img, src, onFileLoaded, resolve);
        img.src = src;
    });
    imageCache.set(src, promise);
    return promise;
}

/**
 * Sets up image event handlers.
 * @param {HTMLImageElement} img Image element.
 * @param {string} src Image source path.
 * @param {Function|null} onFileLoaded Load callback.
 * @param {Function} resolve Promise resolve function.
 * @returns {void}
 */
function setupImageHandlers(img, src, onFileLoaded, resolve) {
    img.onload = () => {
        if (onFileLoaded) onFileLoaded();
        resolve(img);
    };
    img.onerror = () => {
        if (onFileLoaded) onFileLoaded();
        imageCache.delete(src);
        resolve(null);
    };
}

/**
 * Preloads images from a manifest.
 * @param {*} manifest Manifest data.
 * @param {{onFileLoaded?: Function|null, concurrency?: number, manifestConcurrency?: number}} [options={}] Options object.
 * @returns {Promise<*>}
 */
export async function preloadManifestImages(manifest, options = {}) {
    const { onFileLoaded = null, concurrency = 4, manifestConcurrency = Infinity } = options;
    return processManifestNode(manifest, onFileLoaded, { concurrency, manifestConcurrency });
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
    if (isSheetSequenceNode(node)) return processSheetSequenceNode(node, onFileLoaded, config);
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
 * Gets the next index from state.
 * @param {{nextIndex: number, list: Array<*>}} state State object.
 * @returns {number|null}
 */
function getNextIndex(state) {
    return state.nextIndex < state.list.length ? state.nextIndex++ : null;
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
 * Processes a sheet sequence node.
 * @param {{sheets?: Array<*>, loop?: boolean}} node Sheet sequence node.
 * @param {Function|null} onFileLoaded Load callback.
 * @param {{concurrency?: number}} [config={}] Configuration object.
 * @returns {Promise<{type: string, loop: boolean, sheets: Array<*>}|null>}
 */
async function processSheetSequenceNode(node, onFileLoaded, config = {}) {
    const entries = node.sheets ?? [];
    const concurrency = config.concurrency ?? 4;
    const results = new Array(entries.length);
    let nextIndex = 0;
    const workers = createWorkers(Math.min(concurrency, entries.length), () =>
        runSheetSequenceWorker(entries, results, () => nextIndex++, onFileLoaded)
    );
    await Promise.all(workers);
    const sheets = results.filter(Boolean);
    if (!sheets.length) return null;
    return { type: 'sheetSequence', loop: node.loop !== false, sheets };
}

/**
 * Processes sheet sequence entries in a worker loop.
 * @param {Array<*>} entries Sequence entries.
 * @param {Array<*>} results Result list.
 * @param {Function} getNextIndex Index provider.
 * @param {Function|null} onFileLoaded Load callback.
 * @returns {Promise<void>}
 */
async function runSheetSequenceWorker(entries, results, getNextIndex, onFileLoaded) {
    for (
        let currentIndex = getNextManifestIndex(entries.length, getNextIndex);
        currentIndex !== null;
        currentIndex = getNextManifestIndex(entries.length, getNextIndex)
    ) {
        results[currentIndex] = await loadSequenceEntry(entries[currentIndex], { onFileLoaded });
    }
}

/**
 * Loads a sequence entry.
 * @param {{json: string}} entry Sequence entry.
 * @param {{onFileLoaded?: Function|null}} [param1={}] Options object.
 * @returns {Promise<{type: string, meta: *, image: HTMLImageElement}|null>}
 */
async function loadSequenceEntry(entry, { onFileLoaded } = {}) {
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
 * @param {Function|null} onFileLoaded Load callback.
 * @param {{concurrency?: number, manifestConcurrency?: number}} [config={}] Configuration object.
 * @returns {Promise<Array<*>>}
 */
async function processEntries(entries, onFileLoaded, config = {}) {
    const state = createProcessEntriesState(entries, config);
    const workers = createWorkers(state.workerCount, async () => {
        for (
            let currentIndex = getNextManifestIndex(entries.length, () => state.nextIndex++);
            currentIndex !== null;
            currentIndex = getNextManifestIndex(entries.length, () => state.nextIndex++)
        ) {
            await processEntryAtIndex(entries, currentIndex, onFileLoaded, config, state.results);
        }
    });
    await Promise.all(workers);
    return state.results;
}

/**
 * Creates the processing state for manifest entries.
 * @param {Array<*>} entries Manifest entries.
 * @param {{manifestConcurrency?: number}} config Configuration object.
 * @returns {{results: Array<*>, nextIndex: number, workerCount: number}}
 */
function createProcessEntriesState(entries, config) {
    const manifestConcurrency = config.manifestConcurrency ?? Infinity;
    return {
        results: new Array(entries.length),
        nextIndex: 0,
        workerCount: Math.min(manifestConcurrency, entries.length)
    };
}

/**
 * Gets the next manifest index.
 * @param {number} length Total length.
 * @param {Function} getIndex Index provider.
 * @returns {number|null}
 */
function getNextManifestIndex(length, getIndex) {
    const index = getIndex();
    return index >= length ? null : index;
}

/**
 * Processes a manifest entry at a specific index.
 * @param {Array<*>} entries Manifest entries.
 * @param {number} currentIndex Entry index.
 * @param {Function|null} onFileLoaded Load callback.
 * @param {{concurrency?: number, manifestConcurrency?: number}} config Configuration object.
 * @param {Array<*>} results Result list.
 * @returns {Promise<void>}
 */
async function processEntryAtIndex(entries, currentIndex, onFileLoaded, config, results) {
    try {
        const [key, value] = entries[currentIndex];
        const processed = await processEntry(key, value, onFileLoaded, config);
        results[currentIndex] = { status: "fulfilled", value: processed };
    } catch (reason) {
        results[currentIndex] = { status: "rejected", reason };
    }
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