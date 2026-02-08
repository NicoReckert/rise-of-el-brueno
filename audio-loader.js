const audioCache = new Map();

/**
 * Lädt eine einzelne Audio-Datei oder holt sie aus dem Cache.
 * @param {string} src
 * @returns {Promise<HTMLAudioElement>}
 */
export function loadAudio(src) {
  // schon geladen? → direkt zurückgeben
  if (audioCache.has(src)) {
    return Promise.resolve(audioCache.get(src));
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    audio.oncanplay = () => {
      audioCache.set(src, audio); // im Cache merken
      resolve(audio);
    };

    audio.onerror = () => {
      reject(new Error(`Fehler beim Laden von Audio: ${src}`));
    };

    audio.src = src;
    audio.load();
  });
}

/**
 * Lädt alle Audios aus einem Manifest.
 * @param {Object} manifest  key -> url oder [urls]
 * @param {Function} [onFileLoaded]  optionaler Progress-Callback pro Datei
 * @returns {Promise<Object>} key -> HTMLAudioElement | HTMLAudioElement[]
 */
export async function preloadManifestAudio(manifest, onFileLoaded) {
  const entries = Object.entries(manifest);

  const results = await Promise.all(
    entries.map(async ([key, paths]) => {
      const sources = Array.isArray(paths) ? paths : [paths];

      const loaded = await Promise.all(
        sources.map(async (src) => {
          const audio = await loadAudio(src);
          if (typeof onFileLoaded === "function") {
            onFileLoaded(); // jede einzelne Datei zählt
          }
          return audio;
        })
      );

      const audio = loaded.length === 1 ? loaded[0] : loaded;
      return [key, audio];
    })
  );

  return Object.fromEntries(results);
}