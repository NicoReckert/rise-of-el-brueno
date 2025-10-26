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
        if (Array.isArray(node)) {
            // kleine Pause zwischen großen Batches, damit der Browser flüssig bleibt
            const results = [];
            for (const src of node) {
                results.push(await loadImage(src, onProgress));
                await new Promise(r => requestIdleCallback(r, { timeout: 16 }));
            }
            return results;
        } else if (typeof node === "object" && node !== null) {
            const entries = await Promise.all(
                Object.entries(node).map(async ([key, value]) => [key, await processNode(value)])
            );
            return Object.fromEntries(entries);
        } else {
            throw new Error("Invalid manifest node: must be array or object");
        }
    }

    return processNode(manifest);
}


