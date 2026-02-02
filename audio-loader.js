import { allAudios } from "./audio-store.js";

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


export async function preloadManifestAudio(manifest) {
  const entries = Object.entries(manifest);

  const results = await Promise.all(
    entries.map(async ([key, paths]) => {

      // ✅ EXISTIERT SCHON → NICHT NEU LADEN
      if (allAudios[key]) {
        return [key, allAudios[key]];
      }

      const sources = Array.isArray(paths) ? paths : [paths];

      const loaded = await Promise.all(
        sources.map(src => loadAudio(src))
      );

      const audio = loaded.length === 1 ? loaded[0] : loaded;

      // ✅ DIREKT REGISTRIEREN
      allAudios[key] = audio;

      return [key, audio];
    })
  );

  return Object.fromEntries(results);
}