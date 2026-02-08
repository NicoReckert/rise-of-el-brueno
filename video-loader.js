// video-loader.js

/**
 * Hängt ein Video an ein DOM-Element an und liefert ein Mapping,
 * das direkt an den VideoManager übergeben werden kann.
 *
 * Beispiel:
 *   const map = attachVideo("introBg", "start-initialisation-video", "intro.mp4");
 *   videoManager.addVideos(map);
 */
export function attachVideo(key, elementId, src) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`[attachVideo] Container element '${elementId}' not found`);
        return {};
    }

    let video;

    // Falls das Element selbst schon ein <video> ist, benutze es
    if (container.tagName && container.tagName.toLowerCase() === "video") {
        video = container;
    } else {
        // sonst: neues <video> in den Container hängen
        video = document.createElement("video");
        container.appendChild(video);
    }

    video.preload = "none";
    video.muted = true;
    video.playsInline = true;

    // Nur merken, noch nicht direkt src setzen (Lazy-Load)
    video.dataset.src = src;

    return { [key]: video };
}

/**
 * Lädt ein einzelnes Video-Element anhand seines data-src.
 * Setzt src + <source> nur, wenn noch nicht gesetzt.
 */
export function loadVideo(video) {
    return new Promise((resolve, reject) => {
        if (!video) {
            reject("Kein Video übergeben");
            return;
        }

        // Schon geladen / src bereits gesetzt?
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

/**
 * Lädt alle Videos eines Manifests vor.
 * Manifest-Form: { introBg: "intro.mp4", menuBg: "menu.mp4", ... }
 *
 * Rückgabe ist ein Objekt { key: HTMLVideoElement, ... },
 * das du direkt in den VideoManager stecken kannst:
 *
 *   const videos = await preloadManifestVideos(manifest, onFileLoaded);
 *   videoManager.addVideos(videos);
 */
export async function preloadManifestVideos(manifest, onFileLoaded) {
    const entries = Object.entries(manifest);
    const cache = {}; // optionaler interner Cache, falls mehrfach aufgerufen

    const results = await Promise.all(
        entries.map(async ([key, src]) => {
            let video = cache[key];

            if (!video) {
                video = document.createElement("video");
                video.preload = "auto";
                video.playsInline = true;
                video.muted = false; // beim Preload egal, Klang kommt erst beim Play
                video.dataset.src = src;

                cache[key] = video;
            }

            await loadVideo(video);

            if (typeof onFileLoaded === "function") {
                onFileLoaded();
            }

            return [key, video];
        })
    );

    return Object.fromEntries(results);
}
