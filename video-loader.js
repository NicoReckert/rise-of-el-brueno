import { allVideos } from "./media-store.js";

export function attachVideo(key, elementId, src) {
    const el = document.getElementById(elementId);
    if (!el) {
        console.warn(`[attachVideo] Video element '${elementId}' not found yet`);
        return null;
    }

    if (allVideos[key]) {
        return allVideos[key];
    }

    el.preload = "none";
    el.muted = true;
    el.playsInline = true;

    // 🔑 NUR merken, NICHT setzen
    el.dataset.src = src;

    allVideos[key] = el;
    return el;
}

export function loadVideo(video) {
    return new Promise((resolve, reject) => {
        if (!video) return reject("Kein Video übergeben");

        // Schon geladen?
        if (video.src) {
            resolve(video);
            return;
        }

        const src = video.dataset.src;
        if (!src) {
            reject("Kein Video-src vorhanden");
            return;
        }

        const source = document.createElement("source");
        source.src = src;
        source.type = "video/mp4";
        video.appendChild(source);

        video.preload = "auto";

        const cleanup = () => {
            video.removeEventListener("loadeddata", onReady);
            video.removeEventListener("error", onError);
        };

        const onReady = () => {
            cleanup();
            resolve(video);
        };

        const onError = () => {
            cleanup();
            reject(new Error(`Fehler beim Laden: ${src}`));
        };

        video.addEventListener("loadeddata", onReady, { once: true });
        video.addEventListener("error", onError, { once: true });

        video.load();
    });
}

export async function preloadManifestVideos(manifest, onFileLoaded) {
    const entries = Object.entries(manifest);

    const results = await Promise.all(
        entries.map(async ([key, src]) => {
            // Schon ein Video registriert? → wiederverwenden
            let video = allVideos[key];

            if (!video) {
                // eigenes Video-Element im JS (muss nicht im DOM sein)
                video = document.createElement("video");
                video.preload = "auto";
                video.playsInline = true;
                video.muted = false; // für Preload meist leise
                video.dataset.src = src;

                allVideos[key] = video;
            }

            // lädt nur, wenn noch kein src gesetzt ist
            await loadVideo(video);

            if (typeof onFileLoaded === "function") {
                onFileLoaded();
            }

            return [key, video];
        })
    );

    return Object.fromEntries(results);
}