function attachVideoSource(id, src) {
    return new Promise((resolve, reject) => {
        const video = document.getElementById(id);
        if (!video) return reject(new Error(`Video mit ID ${id} nicht gefunden`));

        // Autoplay-Policy freundlich
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "auto";

        // Keine doppelten Quellen
        if (!video.querySelector(`source[src="${src}"]`)) {
            const source = document.createElement("source");
            source.src = src;
            source.type = "video/mp4";
            video.appendChild(source);
        }

        const cleanup = () => {
            video.removeEventListener("canplaythrough", onReady);
            video.removeEventListener("loadeddata", onReady);
            video.removeEventListener("error", onError);
        };

        const onReady = () => { cleanup(); resolve(video); };
        const onError = () => { cleanup(); reject(new Error(`Fehler beim Laden: ${src}`)); };

        video.addEventListener("canplaythrough", onReady, { once: true });
        video.addEventListener("loadeddata", onReady, { once: true }); // Safari-Fallback
        video.addEventListener("error", onError, { once: true });

        try {
            video.load();
            // Direkt checken
            if (video.readyState >= 3) {
                cleanup();
                resolve(video);
            }
        } catch (e) {
            cleanup();
            reject(e);
        }
    });
}
