function loadAudio(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.preload = "auto";
        audio.crossOrigin = "anonymous"; // optional, falls du CDN oder andere Domains nutzt

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
            // Akzeptiert sowohl einzelne Strings als auch Arrays
            const sources = Array.isArray(paths) ? paths : [paths];
            const loaded = await Promise.all(sources.map(loadAudio));

            // 👇 Automatisch entscheiden:
            // Nur ein Audio → gib direkt das Objekt zurück
            // Mehrere Audios → gib das Array zurück
            return [key, loaded.length === 1 ? loaded[0] : loaded];
        })
    );

    return Object.fromEntries(results);
}