function loadImage(src, onProgress) {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            if (onProgress) onProgress(src);
            resolve(img);
        };

        img.onerror = (e) => {
            console.warn('[ImageLoader] Failed to load image:', src, e);
            if (onProgress) onProgress(src);  // Fortschritt trotzdem erhöhen
            resolve(null); // ❗ NIE reject, nur null zurück
        };

        img.src = src;
    });
}


export async function preloadManifestImages(manifest, onProgress) {

    async function processNode(node) {

        // ✅ FALL 1: Array = alte Einzelbilder
        if (Array.isArray(node)) {
            const results = [];
            for (const src of node) {
                const img = await loadImage(src, onProgress);
                if (img) {
                    results.push(img);
                } else {
                    console.warn('[ImageLoader] Skipping broken image in array:', src);
                }
                await new Promise(r => requestIdleCallback(r, { timeout: 16 }));
            }
            return results; // kann auch [] sein
        }

        // ✅ FALL 2: Spritesheet
        if (typeof node === "object" && node !== null && node.type === "sheet") {

            const meta = await loadJSON(node.json);
            if (!meta) {
                console.warn('[ImageLoader] Skipping sheet, JSON missing:', node.json);
                return null;
            }

            const imageSrc = node.json.replace(/\.json$/, '.webp');
            const image = await loadImage(imageSrc, onProgress);

            if (!image) {
                console.warn('[ImageLoader] Skipping sheet, image missing:', imageSrc);
                return null;
            }

            return {
                type: 'sheet',
                meta,
                image,
                anim: node.anim ?? null
            };
        }

        // ✅ FALL: Spritesheet-Sequenz
        if (typeof node === "object" && node?.type === "sheetSequence") {
            const sheets = [];

            for (const entry of node.sheets) {
                const meta = await loadJSON(entry.json);
                if (!meta) {
                    console.warn('[ImageLoader] Skipping sheetSequence entry, JSON missing:', entry.json);
                    continue;
                }

                const imageSrc = entry.json.replace(/\.json$/, '.webp');
                const image = await loadImage(imageSrc, onProgress);

                if (!image) {
                    console.warn('[ImageLoader] Skipping sheetSequence entry, image missing:', imageSrc);
                    continue;
                }

                sheets.push({
                    type: 'sheet',
                    meta,
                    image
                });
            }

            if (!sheets.length) {
                console.warn('[ImageLoader] sheetSequence has no valid sheets, skipping.');
                return null;
            }

            return {
                type: 'sheetSequence',
                loop: node.loop !== false,
                sheets
            };
        }

        // ✅ FALL 3: normales Objekt (rekursiv)
        if (typeof node === "object" && node !== null) {
            const result = {};

            for (const [key, value] of Object.entries(node)) {
                try {
                    const processed = await processNode(value);
                    // ❗ Nur setzen, wenn nicht komplett unbrauchbar
                    if (processed !== null && processed !== undefined) {
                        result[key] = processed;
                    } else {
                        console.warn('[ImageLoader] Skipping key because value is null:', key);
                    }
                } catch (e) {
                    console.warn('[ImageLoader] Error while processing key:', key, e);
                    // Key einfach auslassen
                }
            }

            return result;
        }

        // Früher: throw new Error(...)
        console.warn('[ImageLoader] Invalid manifest node encountered, skipping:', node);
        return null;
    }

    return processNode(manifest);
}



function loadJSON(src) {
    return fetch(src)
        .then(res => {
            if (!res.ok) {
                console.warn('[ImageLoader] Failed to load JSON:', src, res.status);
                return null;
            }
            return res.json().catch(err => {
                console.warn('[ImageLoader] JSON parse error:', src, err);
                return null;
            });
        })
        .catch(err => {
            console.warn('[ImageLoader] JSON fetch error:', src, err);
            return null;
        });
}




