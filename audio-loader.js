import { allAudios } from "./media-store.js";

const audioCache = new Map();



function loadAudio(src) {
  // ✅ schon geladen? → zurückgeben



  if (audioCache.has(src)) {
    return Promise.resolve(audioCache.get(src));
  }
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    audio.oncanplay = () => {
      audioCache.set(src, audio); // ✅ merken
      resolve(audio);
    };

    audio.onerror = () =>
      reject(new Error(`Fehler beim Laden von Audio: ${src}`));

    audio.src = src;
    audio.load();
  });
}


export async function preloadManifestAudio(manifest, onFileLoaded) {
  const entries = Object.entries(manifest);

  const results = await Promise.all(
    entries.map(async ([key, paths]) => {
      const sources = Array.isArray(paths) ? paths : [paths];

      // ✅ Wenn Audio schon existiert, trotzdem Progress hochzählen
      if (allAudios[key]) {
        if (typeof onFileLoaded === "function") {
          sources.forEach(() => onFileLoaded());
        }
        return [key, allAudios[key]];
      }

      const loaded = await Promise.all(
        sources.map(async (src) => {
          const audio = await loadAudio(src);
          if (typeof onFileLoaded === "function") {
            onFileLoaded();     // 👉 jedes einzelne File zählt
          }
          return audio;
        })
      );

      const audio = loaded.length === 1 ? loaded[0] : loaded;
      allAudios[key] = audio;

      return [key, audio];
    })
  );

  return Object.fromEntries(results);
}
