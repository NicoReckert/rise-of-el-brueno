function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = () => reject(new Error(`Fehler beim Laden von Audio: ${src}`));

    audio.src = src;
    audio.load();
  });
}

async function preloadManifestAudio(manifest) {
  const entries = Object.entries(manifest);

  const results = await Promise.all(
    entries.map(async ([key, paths]) => {
      const sources = Array.isArray(paths) ? paths : [paths];
      const loaded = await Promise.all(sources.map(loadAudio));

      return [key, loaded.length === 1 ? loaded[0] : loaded];
    })
  );

  return Object.fromEntries(results);
}
