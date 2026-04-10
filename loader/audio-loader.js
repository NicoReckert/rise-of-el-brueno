const audioCache = new Map();

/**
 * Loads an audio file.
 * @param {string} src Audio source path.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<HTMLAudioElement|null>}
 */
export function loadAudio(src, options = {}) {
  const cacheKey = createAudioCacheKey(src, options);
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey);
  const promise = createAndLoadAudio(src, options);
  audioCache.set(cacheKey, promise);
  return promise;
}

/**
 * Creates an audio cache key.
 * @param {string} src Audio source path.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {string}
 */
function createAudioCacheKey(src, options = {}) {
  const preload = options.preload ?? "auto";
  const readyEvent = options.readyEvent ?? "canplaythrough";
  return `${src}::${preload}::${readyEvent}`;
}

/**
 * Creates and loads an audio file.
 * @param {string} src Audio source path.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<HTMLAudioElement|null>}
 */
function createAndLoadAudio(src, options = {}) {
  return new Promise((resolve) => {
    const audio = createAudioElement(src, options);
    setupAudioHandlers(audio, src, resolve, options);
    audio.load();
  });
}

/**
 * Creates an audio element.
 * @param {string} src Audio source path.
 * @param {{preload?: string}} [options={}] Options object.
 * @returns {HTMLAudioElement}
 */
function createAudioElement(src, options = {}) {
  const audio = new Audio();
  audio.preload = options.preload ?? "auto";
  audio.crossOrigin = "anonymous";
  audio.src = src;
  return audio;
}

/**
 * Sets up audio event handlers.
 * @param {HTMLAudioElement} audio Audio element.
 * @param {string} src Audio source path.
 * @param {Function} resolve Promise resolve function.
 * @param {{preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {void}
 */
function setupAudioHandlers(audio, src, resolve, options = {}) {
  const readyEvent = options.readyEvent ?? "canplaythrough";
  const cacheKey = createAudioCacheKey(src, options);
  const cleanup = () => removeAudioHandlers(audio, readyEvent, onReady, onError);
  const onReady = () => { cleanup(); resolve(audio); };
  const onError = () => { cleanup(); audioCache.delete(cacheKey); resolve(null); };
  audio.addEventListener(readyEvent, onReady, { once: true });
  audio.addEventListener("error", onError, { once: true });
}

/**
 * Removes audio event handlers.
 * @param {HTMLAudioElement} audio Audio element.
 * @param {string} readyEvent Ready event name.
 * @param {Function} onReady Ready event handler.
 * @param {Function} onError Error event handler.
 * @returns {void}
 */
function removeAudioHandlers(audio, readyEvent, onReady, onError) {
  audio.removeEventListener(readyEvent, onReady);
  audio.removeEventListener("error", onError);
}

/**
 * Preloads audio from a manifest.
 * @param {Object} manifest Manifest data.
 * @param {{onFileLoaded?: Function|null, preload?: string, readyEvent?: string, concurrency?: number}} [options={}] Options object.
 * @returns {Promise<Object>}
 */
export async function preloadManifestAudio(manifest, options = {}) {
  const { onFileLoaded = null, preload = "auto", readyEvent = "canplaythrough", concurrency = 2 } = options;
  const entries = Object.entries(manifest);
  const results = new Array(entries.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(concurrency, entries.length) }, () =>
    runManifestAudioWorker(entries, results, () => nextIndex++, { onFileLoaded, preload, readyEvent })
  );
  await Promise.all(workers);
  return Object.fromEntries(results);
}

/**
 * Processes audio manifest entries in a worker loop.
 * @param {Array<*>} entries Manifest entries.
 * @param {Array<*>} results Result list.
 * @param {Function} getNextIndex Index provider.
 * @param {{onFileLoaded?: Function|null, preload?: string, readyEvent?: string}} options Options object.
 * @returns {Promise<void>}
 */
async function runManifestAudioWorker(entries, results, getNextIndex, options) {
  for (let currentIndex = getNextIndex(); currentIndex < entries.length; currentIndex = getNextIndex()) {
    const [key, paths] = entries[currentIndex];
    results[currentIndex] = await loadManifestEntry(key, paths, options);
  }
}

/**
 * Loads an audio manifest entry.
 * @param {*} key Entry key.
 * @param {string|string[]} paths Audio source path or paths.
 * @param {{onFileLoaded?: Function|null, preload?: string, readyEvent?: string}} options Options object.
 * @returns {Promise<[*, *]>}
 */
async function loadManifestEntry(key, paths, options) {
  const sources = Array.isArray(paths) ? paths : [paths];
  const loaded = await Promise.all(
    sources.map(src => loadSingleAudio(src, options))
  );
  const filtered = loaded.filter(Boolean);
  const audio = filtered.length === 0
    ? null
    : filtered.length === 1
      ? filtered[0]
      : filtered;
  return [key, audio];
}

/**
 * Loads a single audio file.
 * @param {string} src Audio source path.
 * @param {{onFileLoaded?: Function|null, preload?: string, readyEvent?: string}} [options={}] Options object.
 * @returns {Promise<*|null>}
 */
async function loadSingleAudio(src, options = {}) {
  const { onFileLoaded } = options;
  try {
    const audio = await loadAudio(src, options);
    if (onFileLoaded) onFileLoaded();
    return audio;
  } catch {
    if (onFileLoaded) onFileLoaded();
    return null;
  }
}