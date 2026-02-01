function loadImage(src, onProgress) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            if (onProgress) onProgress(src);
            resolve(img);
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

async function preloadManifestImages(manifest, onProgress) {

    async function processNode(node) {

        // ✅ FALL 1: Array = alte Einzelbilder
        if (Array.isArray(node)) {
            const results = [];
            for (const src of node) {
                results.push(await loadImage(src, onProgress));
                await new Promise(r => requestIdleCallback(r, { timeout: 16 }));
            }
            return results;
        }

        // ✅ FALL 2: Spritesheet
        if (typeof node === "object" && node !== null && node.type === "sheet") {

            // 1. JSON laden
            const meta = await loadJSON(node.json);

            // 2. Bildpfad ableiten (json ↔ webp)
            const imageSrc = node.json.replace(/\.json$/, '.webp');

            // 3. Bild laden
            const image = await loadImage(imageSrc, onProgress);

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
                const imageSrc = entry.json.replace(/\.json$/, '.webp');
                const image = await loadImage(imageSrc, onProgress);

                sheets.push({
                    type: 'sheet',
                    meta,
                    image
                });
            }

            return {
                type: 'sheetSequence',
                loop: node.loop !== false,
                sheets
            };
        }

        // ✅ FALL 3: normales Objekt (rekursiv)
        if (typeof node === "object" && node !== null) {
            const entries = await Promise.all(
                Object.entries(node).map(
                    async ([key, value]) => [key, await processNode(value)]
                )
            );
            return Object.fromEntries(entries);
        }




        throw new Error("Invalid manifest node");
    }

    return processNode(manifest);
}


function loadJSON(src) {
    return fetch(src).then(res => {
        if (!res.ok) throw new Error(`Failed to load JSON: ${src}`);
        return res.json();
    });
}



