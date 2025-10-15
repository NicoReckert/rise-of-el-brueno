function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
    });
}

async function preloadManifestImages(manifest) {
    async function processNode(node) {
        if (Array.isArray(node)) {
            return Promise.all(node.map(loadImage));
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

