const videoCache = new Map();

/**
 * Attaches a video element to a container and returns it mapped by key.
 * @param {string} key Video identifier key.
 * @param {string} elementId Container element ID.
 * @param {string} src Video source path.
 * @returns {Object<string, HTMLVideoElement>}
 */
export function attachVideo(key, elementId, src) {
    const container = document.getElementById(elementId);
    if (!container) return {};
    const video = getOrCreateConfiguredVideo(container, src);
    return { [key]: video };
}

/**
 * Retrieves or creates a configured video element within a container.
 * @param {HTMLElement} container Target container or video element.
 * @param {string} src Video source path.
 * @returns {HTMLVideoElement}
 */
function getOrCreateConfiguredVideo(container, src) {
    let video = container;
    const tag = container.tagName?.toLowerCase?.() || "";
    if (tag !== "video") {
        video = document.createElement("video");
        container.appendChild(video);
    }
    video.preload = "none";
    video.muted = true;
    video.playsInline = true;
    video.dataset.src = src;
    return video;
}

/**
 * Loads a video.
 * @param {HTMLVideoElement} video Video element.
 * @param {{preload?: string, readyEvent?: string}} [options={}]
 * @returns {Promise<HTMLVideoElement>}
 */
export function loadVideo(video, options = {}) {
    return new Promise((resolve, reject) => {
        if (!ensureVideoElement(video, reject)) return;
        if (ensureAlreadyLoaded(video, resolve, options)) return;
        const src = getVideoSource(video, reject);
        if (!src) return;
        initAndLoadVideo(video, src, resolve, reject, options);
    });
}

/**
 * Validates that a video element is provided.
 * @param {HTMLVideoElement} video Video element to validate.
 * @param {Function} reject Promise reject function.
 * @returns {boolean}
 */
function ensureVideoElement(video, reject) {
    if (!video) {
        reject(new Error("No video element provided"));
        return false;
    }
    return true;
}

/**
 * Checks if the video is already loaded.
 * @param {HTMLVideoElement} video Video element.
 * @param {Function} resolve Promise resolve function.
 * @param {{readyEvent?: string}} [options={}] Options object.
 * @returns {boolean} True if already loaded, otherwise false.
 */
function ensureAlreadyLoaded(video, resolve, options = {}) {
    const readyEvent = options.readyEvent ?? "canplaythrough";
    const requiredReadyState = getRequiredReadyState(readyEvent);
    if (video.readyState >= requiredReadyState) {
        resolve(video);
        return true;
    }
    return false;
}

/**
 * Gets the required ready state for a video event.
 * @param {string} readyEvent Ready event name.
 * @returns {number}
 */
function getRequiredReadyState(readyEvent) {
    switch (readyEvent) {
        case "loadedmetadata":
            return 1;
        case "loadeddata":
            return 2;
        case "canplay":
            return 3;
        case "canplaythrough":
        default:
            return 4;
    }
}

/**
 * Retrieves the video source from the element dataset.
 * @param {HTMLVideoElement} video Video element.
 * @param {Function} reject Promise reject function.
 * @returns {string|null}
 */
function getVideoSource(video, reject) {
    const src = video.dataset?.src;
    if (!src) {
        reject(new Error("No video src found on element"));
        return null;
    }
    return src;
}

/**
 * Initializes and loads a video.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 * @param {Function} resolve Promise resolve function.
 * @param {Function} reject Promise reject function.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {void}
 */
function initAndLoadVideo(video, src, resolve, reject, options = {}) {
    prepareVideoSource(video, src);
    attachVideoListeners(video, src, resolve, reject, options);
    video.preload = options.preload ?? "auto";
    video.load();
}

/**
 * Appends a source element to the video if not already present.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 */
function prepareVideoSource(video, src) {
    const existing = video.querySelector(`source[src="${src}"]`);
    if (existing) return;
    video.innerHTML = "";
    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    video.appendChild(source);
}

/**
 * Attaches video event listeners.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 * @param {Function} resolve Promise resolve function.
 * @param {Function} reject Promise reject function.
 * @param {{readyEvent?: string}} [options={}] Options object.
 * @returns {void}
 */
function attachVideoListeners(video, src, resolve, reject, options = {}) {
    const readyEvent = options.readyEvent ?? "canplaythrough";
    const { onReady, onError } = createVideoHandlers(video, src, resolve, reject, readyEvent);
    video.addEventListener(readyEvent, onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
}

/**
 * Creates video event handlers.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 * @param {Function} resolve Promise resolve function.
 * @param {Function} reject Promise reject function.
 * @param {string} readyEvent Ready event name.
 * @returns {{onReady: Function, onError: Function}}
 */
function createVideoHandlers(video, src, resolve, reject, readyEvent) {
    const cleanup = (onReady, onError) => {
        removeVideoListeners(video, readyEvent, onReady, onError);
    };
    const onReady = () => {
        cleanup(onReady, onError);
        resolve(video);
    };
    const onError = () => {
        cleanup(onReady, onError);
        reject(new Error(`Failed to load video: ${src}`));
    };
    return { onReady, onError };
}

/**
 * Removes video event listeners.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} readyEvent Ready event name.
 * @param {Function} onReady Ready event handler.
 * @param {Function} onError Error event handler.
 * @returns {void}
 */
function removeVideoListeners(video, readyEvent, onReady, onError) {
    video.removeEventListener(readyEvent, onReady);
    video.removeEventListener("error", onError);
}

/**
 * Preloads videos from a manifest.
 * @param {Object} manifest Manifest data.
 * @param {{onFileLoaded?: Function|null, preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<Object>}
 */
export async function preloadManifestVideos(manifest, options = {}) {
    const { onFileLoaded = null, preload = "auto", readyEvent = "canplaythrough" } = options;
    const entries = Object.entries(manifest);
    const results = await Promise.all(
        entries.map(([key, src]) =>
            loadVideoManifestEntry(key, src, { onFileLoaded, preload, readyEvent })
        )
    );
    return Object.fromEntries(results);
}

/**
 * Loads a video manifest entry.
 * @param {*} key Entry key.
 * @param {string} src Video source path.
 * @param {{onFileLoaded?: Function|null, preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<[*, HTMLVideoElement|null]>}
 */
async function loadVideoManifestEntry(key, src, options = {}) {
    const { onFileLoaded } = options;
    const video = await loadCachedVideo(src, options);
    if (onFileLoaded) onFileLoaded();
    return [key, video];
}

/**
 * Creates a preconfigured video element.
 * @param {string} src Video source path.
 * @param {{preload?: string}} [options={}] Options object.
 * @returns {HTMLVideoElement}
 */
function createPreconfiguredVideo(src, options = {}) {
    const video = document.createElement("video");
    video.preload = options.preload ?? "auto";
    video.playsInline = true;
    video.muted = true;
    video.dataset.src = src;
    return video;
}

/**
 * Loads a cached video.
 * @param {string} src Video source path.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<HTMLVideoElement|null>}
 */
function loadCachedVideo(src, options = {}) {
    const cacheKey = createVideoCacheKey(src, options);
    if (videoCache.has(cacheKey)) return videoCache.get(cacheKey);
    const promise = createAndLoadCachedVideo(src, options);
    videoCache.set(cacheKey, promise);
    return promise;
}

/**
 * Creates a video cache key.
 * @param {string} src Video source path.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {string}
 */
function createVideoCacheKey(src, options = {}) {
    const preload = options.preload ?? "auto";
    const readyEvent = options.readyEvent ?? "canplaythrough";
    return `${src}::${preload}::${readyEvent}`;
}

/**
 * Creates and loads a cached video.
 * @param {string} src Video source path.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<HTMLVideoElement|null>}
 */
function createAndLoadCachedVideo(src, options = {}) {
    const cacheKey = createVideoCacheKey(src, options);
    return new Promise((resolve) => {
        const video = createPreconfiguredVideo(src, options);
        loadVideo(video, options)
            .then(resolve)
            .catch(() => {
                videoCache.delete(cacheKey);
                resolve(null);
            });
    });
}