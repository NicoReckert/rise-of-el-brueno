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
 * Loads a video element asynchronously.
 * @param {HTMLVideoElement} video Video element to load.
 * @returns {Promise<HTMLVideoElement>}
 */
export function loadVideo(video) {
    return new Promise((resolve, reject) => {
        if (!ensureVideoElement(video, reject)) return;
        if (ensureAlreadyLoaded(video, resolve)) return;
        const src = getVideoSource(video, reject);
        if (!src) return;
        initAndLoadVideo(video, src, resolve, reject);
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
 * Resolves immediately if the video is already loaded.
 * @param {HTMLVideoElement} video Video element to check.
 * @param {Function} resolve Promise resolve function.
 * @returns {boolean}
 */
function ensureAlreadyLoaded(video, resolve) {
    if (video.src) {
        resolve(video);
        return true;
    }
    return false;
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
 * Initializes and starts loading a video element.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 * @param {Function} resolve Promise resolve function.
 * @param {Function} reject Promise reject function.
 */
function initAndLoadVideo(video, src, resolve, reject) {
    prepareVideoSource(video, src);
    attachVideoListeners(video, src, resolve, reject);
    video.preload = "auto";
    video.load();
}

/**
 * Appends a source element to the video.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 */
function prepareVideoSource(video, src) {
    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    video.appendChild(source);
}

/**
 * Attaches load and error listeners to a video element.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 * @param {Function} resolve Promise resolve function.
 * @param {Function} reject Promise reject function.
 */
function attachVideoListeners(video, src, resolve, reject) {
    const { onReady, onError } = createVideoHandlers(video, src, resolve, reject);
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
}

/**
 * Creates ready and error handlers for a video element.
 * @param {HTMLVideoElement} video Video element.
 * @param {string} src Video source path.
 * @param {Function} resolve Promise resolve function.
 * @param {Function} reject Promise reject function.
 * @returns {{onReady: Function, onError: Function}}
 */
function createVideoHandlers(video, src, resolve, reject) {
    const cleanup = (onReady, onError) => {
        removeVideoListeners(video, onReady, onError);
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
 * Removes previously attached video event listeners.
 * @param {HTMLVideoElement} video Video element.
 * @param {Function} onReady Ready event handler.
 * @param {Function} onError Error event handler.
 */
function removeVideoListeners(video, onReady, onError) {
    video.removeEventListener("loadeddata", onReady);
    video.removeEventListener("error", onError);
}

/**
 * Preloads videos defined in a manifest.
 * @param {Object} manifest Video manifest configuration.
 * @param {Function} [onFileLoaded] Optional callback triggered after each file.
 * @returns {Promise<Object>}
 */
export async function preloadManifestVideos(manifest, onFileLoaded) {
    const entries = Object.entries(manifest);
    const cache = {};
    const results = await Promise.all(
        entries.map(([key, src]) =>
            loadVideoManifestEntry(key, src, cache, onFileLoaded)
        )
    );
    return Object.fromEntries(results);
}

/**
 * Loads a single video manifest entry.
 * @param {string} key Manifest entry key.
 * @param {string} src Video source path.
 * @param {Object} cache Video cache object.
 * @param {Function} [onFileLoaded] Optional callback triggered after load.
 * @returns {Promise<[string, HTMLVideoElement]>}
 */
async function loadVideoManifestEntry(key, src, cache, onFileLoaded) {
    const video = getOrCreateVideo(cache, key, src);
    await loadVideo(video);
    if (typeof onFileLoaded === "function") onFileLoaded();
    return [key, video];
}

/**
 * Retrieves a cached video or creates a new one.
 * @param {Object} cache Video cache object.
 * @param {string} key Manifest entry key.
 * @param {string} src Video source path.
 * @returns {HTMLVideoElement}
 */
function getOrCreateVideo(cache, key, src) {
    if (cache[key]) return cache[key];
    const video = createPreconfiguredVideo(src);
    cache[key] = video;
    return video;
}

/**
 * Creates a preconfigured video element.
 * @param {string} src Video source path.
 * @returns {HTMLVideoElement}
 */
function createPreconfiguredVideo(src) {
    const video = document.createElement("video");
    video.preload = "auto";
    video.playsInline = true;
    video.muted = false;
    video.dataset.src = src;
    return video;
}