const audioCache = new Map();

/**
 * Loads an audio file with caching support.
 * @param {string} src Audio source path.
 * @returns {Promise<HTMLAudioElement>}
 */
export function loadAudio(src) {
  if (audioCache.has(src)) {
    return Promise.resolve(audioCache.get(src));
  }
  return createAndLoadAudio(src);
}

/**
 * Creates and loads an audio element.
 * @param {string} src Audio source path.
 * @returns {Promise<HTMLAudioElement>}
 */
function createAndLoadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = createAudioElement(src);
    audio.oncanplay = () => handleAudioReady(src, audio, resolve);
    audio.onerror = () => {
      reject(new Error(`Failed to load audio: ${src}`));
    };
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
 * Caches a loaded audio element and resolves the promise.
 * @param {string} src Audio source path.
 * @param {HTMLAudioElement} audio Loaded audio element.
 * @param {Function} resolve Promise resolve function.
 */
function handleAudioReady(src, audio, resolve) {
  audioCache.set(src, audio);
  resolve(audio);
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
 * Loads a single audio manifest entry.
 * @param {string} key Manifest entry key.
 * @param {string|string[]} paths Audio source path(s).
 * @param {Function} [onFileLoaded] Optional callback triggered after each file.
 * @returns {Promise<[string, HTMLAudioElement|HTMLAudioElement[]]>}
 */
async function loadManifestEntry(key, paths, onFileLoaded) {
  const sources = Array.isArray(paths) ? paths : [paths];
  const loaded = await Promise.all(
    sources.map(src => loadSingleAudio(src, onFileLoaded))
  );
  const audio = loaded.length === 1 ? loaded[0] : loaded;
  return [key, audio];
}

/**
 * Loads a single audio file and triggers an optional callback.
 * @param {string} src Audio source path.
 * @param {Function} [onFileLoaded] Optional callback triggered after load.
 * @returns {Promise<HTMLAudioElement>}
 */
async function loadSingleAudio(src, onFileLoaded) {
  const audio = await loadAudio(src);
  if (typeof onFileLoaded === "function") {
    onFileLoaded();
  }
  return audio;
}