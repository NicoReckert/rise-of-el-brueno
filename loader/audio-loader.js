const audioCache = new Map();

/**
 * Loads an audio file with caching support.
 * @param {string} src Audio source path.
 * @returns {Promise<HTMLAudioElement|null>}
 */
export function loadAudio(src) {
  if (audioCache.has(src)) return audioCache.get(src);
  const promise = createAndLoadAudio(src);
  audioCache.set(src, promise);
  return promise;
}

/**
 * Creates and loads an audio element.
 * @param {string} src Audio source path.
 * @returns {Promise<HTMLAudioElement|null>}
 */
function createAndLoadAudio(src) {
  return new Promise((resolve) => {
    const audio = createAudioElement(src);
    setupAudioHandlers(audio, src, resolve);
    audio.load();
  });
}

/**
 * Creates and configures an audio element.
 * @param {string} src Audio source path.
 * @returns {HTMLAudioElement}
 */
function createAudioElement(src) {
  const audio = new Audio();
  audio.preload = "auto";
  audio.crossOrigin = "anonymous";
  audio.src = src;
  return audio;
}

/**
 * Sets up audio event handlers.
 * @param {*} audio Audio instance.
 * @param {*} src Audio source.
 * @param {Function} resolve Promise resolve function.
 * @returns {void}
 */
function setupAudioHandlers(audio, src, resolve) {
  const onReady = () => {
    audio.removeEventListener("canplaythrough", onReady);
    audio.removeEventListener("error", onError);
    handleAudioReady(audio, resolve);
  };
  const onError = () => {
    audio.removeEventListener("canplaythrough", onReady);
    audio.removeEventListener("error", onError);
    handleAudioError(src, resolve);
  };
  audio.addEventListener("canplaythrough", onReady, { once: true });
  audio.addEventListener("error", onError, { once: true });
}

/**
 * Resolves a loaded audio element.
 * @param {HTMLAudioElement} audio Loaded audio element.
 * @param {Function} resolve Promise resolve function.
 */
function handleAudioReady(audio, resolve) {
  resolve(audio);
}

/**
 * Handles audio load failure by clearing the cache entry.
 * @param {string} src Audio source path.
 * @param {Function} resolve Promise resolve function.
 */
function handleAudioError(src, resolve) {
  audioCache.delete(src);
  resolve(null);
}

/**
 * Preloads audio files defined in a manifest.
 * @param {Object} manifest Audio manifest configuration.
 * @param {Function} [onFileLoaded] Optional callback triggered after each file.
 * @returns {Promise<Object>}
 */
export async function preloadManifestAudio(manifest, onFileLoaded) {
  const entries = Object.entries(manifest);
  const results = await Promise.all(
    entries.map(([key, paths]) =>
      loadManifestEntry(key, paths, onFileLoaded)
    )
  );
  return Object.fromEntries(results);
}

/**
 * Loads and normalizes a single audio manifest entry.
 * @param {string} key Manifest entry key.
 * @param {string|string[]} paths Audio source path(s).
 * @param {Function} [onFileLoaded] Optional callback triggered after each file.
 * @returns {Promise<[string, HTMLAudioElement|HTMLAudioElement[]|null]>}
 */
async function loadManifestEntry(key, paths, onFileLoaded) {
  const sources = Array.isArray(paths) ? paths : [paths];
  const loaded = await Promise.all(
    sources.map(src => loadSingleAudio(src, onFileLoaded))
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
 * Loads a single audio file and triggers an optional callback.
 * @param {string} src Audio source path.
 * @param {Function} [onFileLoaded] Optional callback triggered after load.
 * @returns {Promise<HTMLAudioElement|null>}
 */
async function loadSingleAudio(src, onFileLoaded) {
  try {
    const audio = await loadAudio(src);
    if (typeof onFileLoaded === "function") onFileLoaded();
    return audio;
  } catch {
    if (typeof onFileLoaded === "function") onFileLoaded();
    return null;
  }
}